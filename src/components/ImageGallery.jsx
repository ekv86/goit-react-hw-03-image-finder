import { Component } from 'react';
import { getImages } from '../services/fetch_API';
import { SearchBar } from './Searchbar';
import { ImageGalleryItem } from './ImageGalleryItem';
import { Button } from './Button';
import { Modal } from './Modal';
import { Circles } from 'react-loader-spinner';
import css from './styles.module.css';

const perPage = 12;

export class ImageGallery extends Component {
  state = {
    value: '',
    searchResult: [],
    currentPage: 1,
    totalPage: 0,
    isLoading: false,
    error: '',
    isShowModal: false,
    selectImgLink: null,
  };

  componentDidUpdate(_, prevState) {
    if (
      prevState.value !== this.state.value ||
      prevState.currentPage !== this.state.currentPage
    ) {
      const { value, currentPage } = this.state;
      this.setState({ isLoading: true });
      getImages(value, currentPage)
        .then(searchResult => {
          if (searchResult.total === 0) {
            throw new Error();
          }

          this.setState(prevState => ({
            searchResult: [...prevState.searchResult, ...searchResult.hits],
            totalPage: Math.ceil(searchResult.total / perPage),
          }));
        })
        .catch(() =>
          this.setState({
            error: `Sorry, we can't find ${value}`,
          })
        )
        .finally(() => this.setState({ isLoading: false }));
    }
  }

  handleFormSubmit = value => {
    this.setState({
      value,
      currentPage: 1,
      searchResult: [],
      error: '',
      totalPage: 0,
    });
  };

  handleClickBtn = () => {
    this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
  };

  selectImg = link => {
    this.setState({ selectImgLink: link, isShowModal: true });
  };

  closeModal = e => {
    this.setState({ isShowModal: false });
  };

  render() {
    const {
      searchResult,
      currentPage,
      error,
      totalPage,
      isLoading,
      isShowModal,
      selectImgLink,
    } = this.state;
    return (
      <div className={css.container}>
        <SearchBar onSubmit={this.handleFormSubmit} />
        {error && <h3 className={css.error}>{error}</h3>}
        <ul className={css.imageGallery}>
          {searchResult.map(({ id, webformatURL, largeImageURL, tags }) => (
            <ImageGalleryItem
              key={id}
              url={webformatURL}
              tags={tags}
              largeUrl={largeImageURL}
              onSelect={this.selectImg}
            />
          ))}
        </ul>
        {isLoading && (
          <Circles
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{ marginLeft: '40%' }}
            wrapperClass=""
            visible={true}
          />
        )}
        {totalPage > 1 && currentPage !== totalPage && !isLoading && (
          <Button onClick={this.handleClickBtn} />
        )}

        {isShowModal && (
          <Modal onClose={this.closeModal}>
            <img src={selectImgLink} alt="" />
          </Modal>
        )}
      </div>
    );
  }
}
