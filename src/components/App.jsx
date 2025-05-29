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
  const [newHits, setNewHits] = useState(1);

  useEffect(() => {
    if (inputSearch) {
      setLoading(true);
      imagesApi(inputSearch, pages)
        .then(({ hits, totalHits }) => {
          setTotalHits(totalHits);
          if (hits.length === 0) {
            setNewHits(0);
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
        })
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    }
  }, [images.length, inputSearch, pages]);

  useEffect(() => {
    if (pages > 1) {
      onLoadMoreScroll(pages);
    }
  }, [images, pages]);

  useEffect(() => {
    if (images.length >= totalHits && totalHits > 0) {
      toast.error('You have reached the end of the collection.');
    }
  }, [images.length, totalHits]);

  const formSubmitHandler = ({ inputSearch }) => {
    setInputSearch(inputSearch);
    setPages(1);
    setImages([]);
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
  console.log(images.length, totalHits);
  return (
    <Container>
      <SearchBar onSubmit={formSubmitHandler} />
      <ImageGallery images={images} showModal={toggleModal} />
      {loading && <Loader />}
      {!loading &&
        images.length < totalHits &&
        images.length > 0 &&
        newHits > 0 && <Button onLoadMore={onLoadMoreButton} />}
      {showModal && <Modal openModal={modalImageUrl} closeModal={closeModal} />}
      <ToastContainer autoClose={3000} />
    </Container>
  );
};
