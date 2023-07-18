import { Component } from 'react';
import { getImages } from './fetch_API';
import { ImageGalleryItem } from './ImageGalleryItem';
import { Button } from './Button';
import { Modal } from './Modal';
import { Circles } from 'react-loader-spinner';
import css from './styles.module.css';

const STATUS = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
};

const perPage = 12;
let currentPage = 1;

export class ImageGallery extends Component {
  state = {
    searchResult: null,
    totalPage: 0,
    isLoading: false,
    status: STATUS.idle,
    error: '',
    isShowModal: false,
    selectImgLink: null,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.searchValue !== this.props.searchValue) {
      currentPage = 1;
      this.setState({ status: STATUS.pending });
      getImages(this.props.searchValue)
        .then(searchResult => {
          if (searchResult.total === 0) {
            throw new Error();
          }
          this.setState({
            searchResult: searchResult.hits,
            totalPage: Math.ceil(searchResult.total / perPage),
            status: STATUS.resolved,
          });
        })
        .catch(() =>
          this.setState({
            error: `Sorry, we can't find ${this.props.searchValue}`,
            status: STATUS.rejected,
          })
        );
    }
  }

  handleClickBtn = () => {
    currentPage += 1;
    this.setState({ isLoading: true });
    getImages(this.props.searchValue, currentPage)
      .then(searchResult =>
        this.setState(prevState => ({
          searchResult: [...prevState.searchResult, ...searchResult.hits],
          isLoading: false,
        }))
      )
      .catch(() =>
        this.setState({
          error: 'Sorry, try again',
          status: STATUS.rejected,
        })
      );
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
      status,
      error,
      totalPage,
      isLoading,
      isShowModal,
      selectImgLink,
    } = this.state;

    if (status === STATUS.pending) {
      return (
        <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{ marginLeft: '40%' }}
          wrapperClass=""
          visible={true}
        />
      );
    }
    if (status === STATUS.rejected) {
      return <h3>{error}</h3>;
    }
    if (status === STATUS.resolved) {
      return (
        <>
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
          {totalPage > 1 && currentPage !== totalPage && (
            <Button onClick={this.handleClickBtn} />
          )}
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
          {isShowModal && (
            <Modal onClose={this.closeModal}>
              <img src={selectImgLink} alt="" />
            </Modal>
          )}
        </>
      );
    }
  }
}
