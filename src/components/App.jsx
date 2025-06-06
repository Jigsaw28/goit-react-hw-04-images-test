import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Container } from './App.styled';
import { SearchBar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { imagesApi } from 'api/imagesApi';
import { Loader } from './Loader/Loader';
import { onLoadMoreScroll } from 'utils/scroll';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [inputSearch, setInputSearch] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState();
  const [totalHits, setTotalHits] = useState(0);
  const [fullHits, setFullHits] = useState([]);

  useEffect(() => {
    if (inputSearch) {
      setLoading(true);
      imagesApi(inputSearch, pages)
        .then(({ hits, totalHits }) => {
          setTotalHits(totalHits);
          if (hits.length === 0) {
            return toast.error(
              `Don't found name ${inputSearch} , enter something else please!`
            );
          }
          setImages(prev => {
            const uniqueHits = hits.filter(
              hit => !prev.some(image => image.id === hit.id)
            );
            return [...prev, ...uniqueHits];
          });
          setFullHits(prev => [...prev, ...hits]);
        })
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    }
  }, [inputSearch, pages]);

  useEffect(() => {
    if (pages > 1) {
      onLoadMoreScroll(pages);
    }
  }, [images, pages]);

  useEffect(() => {
    if (fullHits.length >= totalHits && totalHits > 0) {
      toast.error('You have reached the end of the collection.');
    }
  }, [fullHits.length, totalHits]);

  const formSubmitHandler = ( inputSearch ) => {
    setInputSearch(inputSearch);
    setPages(1);
    setImages([]);
    setTotalHits(0);
  };

  const toggleModal = modalImageUrl => {
    setModalImageUrl(modalImageUrl);
    setShowModal(!showModal);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const onLoadMoreButton = () => {
    setPages(prev => prev + 1);
  };
  
  return (
    <Container>
      <SearchBar onSubmit={formSubmitHandler} />
      <ImageGallery images={images} showModal={toggleModal} />
      {loading && <Loader />}
      {!loading &&
        fullHits.length < totalHits &&
        fullHits.length > 0 && <Button onLoadMore={onLoadMoreButton} />}
      {showModal && <Modal openModal={modalImageUrl} closeModal={closeModal} />}
      <ToastContainer autoClose={3000} />
    </Container>
  );
};
