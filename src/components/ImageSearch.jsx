import { Component } from 'react';
import { SearchBar } from './Searchbar';
import { ImageGallery } from './ImageGallery';
import css from './styles.module.css';

export class ImageSearch extends Component {
  state = {
    value: '',
  };
  handleFormSubmit = value => {
    this.setState({ value });
  };

  render() {
    return (
      <div className={css.container}>
        <SearchBar onSubmit={this.handleFormSubmit} />
        <ImageGallery searchValue={this.state.value} />
      </div>
    );
  }
}
