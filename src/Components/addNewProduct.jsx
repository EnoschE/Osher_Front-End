import React, { Component } from 'react';
import { saveProduct, getProduct } from '../services/productService';
// import { uploadImage } from '../services/fileService';
import { Link } from 'react-router-dom';
import Joi from 'joi-browser';
import Input from './common/input';
import Select from './common/select';
import categories from '../services/categories';
import { storage } from '../firebase/firebase';
import TextArea from './common/textArea';
import auth from '../services/authService';

class AddNewProduct extends Component {
  state = {
    file: '',
    imagePreviewUrl: '/img/img1.jpg',
    product: {
      name: '',
      brandId: '',
      category: '',
      details: '',
      description: '',
      inStock: '',
      img: [],
      offers: [],
    },
    categories: [],
    errors: {},
    heading: 'Add New Product',
    offers: [
      {
        id: 1,
        offerDetails: '',
        price: '',
      },
    ],
    img: [
      '/img/img1.jpg',
      '/img/img2.jpg',
      '/img/img3.jpg',
      '/img/img4.jpg',
      '/img/img5.jpg',
    ],
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label('Name'),
    size: Joi.string().required().label('Size'),
    category: Joi.string().required().label('Category'),
    details: Joi.string().required().label('Details'),
    description: Joi.string().required().label('Description'),
    inStock: Joi.number().min(0).max(10000).required().label('Stock quantity'),
  };

  async populateProducts() {
    try {
      const productId = this.props.match.params.id;
      if (productId) {
        if (productId === 'new') return;

        const { data: product } = await getProduct(productId);
        this.setState({
          product: this.mapToViewModel(product),
          // imagePreviewUrl: product.img,
          img: product.img,
          offers: product.offers,
          heading: 'Update Product',
        });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  populateCategories() {
    // const categories = categories;
    let cat = categories.filter((c) => c !== 'All');
    this.setState({ categories: cat });
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    const user = auth.getCurrentUser();

    this.setState({ user });

    this.populateCategories();
    await this.populateProducts();
  }

  mapToViewModel(product) {
    return {
      _id: product._id,
      name: product.name,
      category: product.category,
      brandId: product.brandId,
      details: product.details,
      description: product.description,
      img: product.img,
      offers: product.offers,
      inStock: product.inStock,
    };
  }

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.product, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  addOffer = () => {
    let offers = [...this.state.offers];
    let maxId = 1;
    if (offers.length > 0) {
      maxId = Math.max.apply(
        Math,
        offers.map(function (o) {
          return o.id;
        })
      );

      maxId++;
    }
    
    offers.push({ id: maxId, offerDetails: '', price: '' });

    this.setState({ offers });
  };

  removeOffer = (offer) => {
    let offers = [...this.state.offers];
    offers = offers.filter((o) => o !== offer);
    this.setState({ offers });
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const product = { ...this.state.product };
    product[input.name] = input.value;

    this.setState({ product, errors });
  };

  handleOfferChange = ({ currentTarget: input }, offer) => {
    // const errors = { ...this.state.errors };
    // const errorMessage = this.validateProperty(input);

    // if (errorMessage) errors[input.name] = errorMessage;
    // else delete errors[input.name];

    const offers = [...this.state.offers];
    const index = offers.indexOf(offer);
    offers[index][input.name] = input.value;

    this.setState({ offers });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    // if (errors) return;

    this.doSubmit();
  };

  doSubmit = async () => {
    const { product, img, offers, user } = this.state;
    product.img = img;
    product.offers = offers;
    product.brandId = user._id;
    console.log(product);
    const res = await saveProduct(product);
    console.log(res);

    let message = 'Product added successfully!';

    if (this.props.match.params.id) message = 'Product updated successfully!';

    this.props.handleNotification({
      message: message,
      img: '/img/success.png',
    });

    this.props.history.push('/dashboard/products/');
  };

  _handleImageChange = (e) => {
    e.preventDefault();

    let file = e.target.files[0];

    this.setState({
      file,
      loaded: 0,
    });

    const uploadTask = storage.ref(`images/${file.name}`).put(file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ loaded: progress });
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref('images')
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            const img = [...this.state.img];
            img.push(url);
            this.setState({ img });
            // this.setState({ imagePreviewUrl: url });
          });
      }
    );
  };

  removeImage = (image) => {
    let img = [...this.state.img];
    console.log(image);
    img = img.filter((o) => o !== image);
    this.setState({ img });
  };

  // handleImageUpload = async (e) => {
  //   e.preventDefault();

  //   const { file: image } = this.state;

  //   const uploadTask = storage.ref(`images/${image.name}`).put(image);
  //   uploadTask.on(
  //     'state_changed',
  //     (snapshot) => {
  //       const progress = Math.round(
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       );
  //       this.setState({ loaded: progress });
  //     },
  //     (error) => {
  //       console.log(error);
  //     },
  //     () => {
  //       storage
  //         .ref('images')
  //         .child(image.name)
  //         .getDownloadURL()
  //         .then((url) => {
  //           this.setState({ imagePreviewUrl: url });
  //         });
  //     }
  //   );

  //   // const data = new FormData();
  //   // data.append('photo', this.state.file);

  //   // const { data: imagePreviewUrl } = await uploadImage(data, {
  //   //   onUploadProgress: (pe) => {
  //   //     this.setState({
  //   //       loaded: (pe.loaded / pe.total) * 100,
  //   //     });
  //   //   },
  //   // });
  //   // this.setState({ imagePreviewUrl });
  //   // console.log(imagePreviewUrl);

  //   // return false;
  // };

  render() {
    let { imagePreviewUrl, file } = this.state;
    const { product, errors, offers, categories, heading, img } = this.state;

    return (
      <div className='container add-product-page'>
        <h1>{heading}</h1>
        <div className='row'>
          <div className='col-md-7 add-product-form'>
            <form onSubmit={this.handleSubmit}>
              <label htmlFor=''>Bundle Name</label>
              <Input
                type='text'
                placeholder='Bundle Name'
                name='name'
                value={product.name}
                onChange={this.handleChange}
                error={errors.name}
              />

              <Select
                options={categories}
                name='category'
                value={product.category}
                def={true}
                label='Category'
                onChange={this.handleChange}
                error={errors.category}
              />

              <label htmlFor=''>Choose Images (Max 5)</label>
              <div className='add-images-block'>
                {img.map((i) => (
                  <div className='img-box'>
                    <div
                      className='remove-img-btn'
                      onClick={() => this.removeImage(i)}
                    >
                      X
                    </div>
                    <img src={i} alt={i} />
                  </div>
                ))}
                {img.length < 5 && (
                  <label className='image-input-label'>
                    +
                    <input
                      type='file'
                      size='60'
                      onChange={this._handleImageChange}
                    />
                  </label>
                )}
              </div>

              {/* <div>
                <div className='input-group'>
                  <div className='custom-file'>
                    <input
                      onChange={this._handleImageChange}
                      type='file'
                      className='custom-file-input'
                      id='inputGroupFile04'
                    />
                    <label
                      className='custom-file-label'
                      htmlFor='inputGroupFile04'
                    >
                      +
                      {file ? file.name : 'Choose image'}
                    </label>
                  </div>

                  <div className='input-group-append'>
                    <button
                      onClick={(e) => this.handleImageUpload(e)}
                      className='btn btn-outline-secondary'
                      type='submit'
                      style={{ fontSize: '14px' }}
                    >
                      Upload
                    </button>
                  </div>
                </div>
                <div
                  className='progress'
                  style={{ width: '60%', marginBottom: '15px' }}
                >
                  <div
                    className='progress-bar bg-success progress-bar-striped progress-bar-animated'
                    role='progressbar'
                    style={{ width: this.state.loaded + '%' }}
                    aria-valuenow={this.state.loaded}
                    aria-valuemin='0'
                    aria-valuemax='100'
                  >
                    {this.state.loaded > 0 && this.state.loaded + '%'}
                  </div>
                </div>

                <img width='60%' alt='' src={imagePreviewUrl} />
              </div> */}

              <label htmlFor=''>Details</label>
              <TextArea
                type='text'
                placeholder='Details'
                name='details'
                value={product.details}
                onChange={this.handleChange}
                error={errors.details}
              />

              <label htmlFor=''>Description</label>
              <TextArea
                type='text'
                placeholder='Description'
                name='description'
                value={product.description}
                onChange={this.handleChange}
                error={errors.description}
              />

              <label htmlFor=''>Quantity in Stock</label>
              <Input
                type='number'
                placeholder='Quantity in Stock'
                name='inStock'
                value={product.inStock}
                onChange={this.handleChange}
                error={errors.inStock}
              />

              {/* <label htmlFor=''>Price</label>
              <Input
                type='number'
                placeholder='Price'
                name='price'
                value={product.price}
                onChange={this.handleChange}
                error={errors.price}
              /> */}

              <button className='login-btn'>Save</button>
            </form>
            <Link to='/dashboard/products/'>
              <button className='cancel-btn'>Cancel</button>
            </Link>
          </div>

          <div className='col-md-5 product-image'>
            {/* <input type='file' onChange={this._handleImageChange} />
                <button
                  type='submit'
                  onClick={(e) => this.handleImageUpload(e)}
                >
                  Upload Image
                </button> */}

            <div className='extendable-offers' style={{ width: '100%' }}>
              {offers.map((o) => (
                <div key={o.id} className='offer-input-block'>
                  <div style={{ width: '100%' }}>
                    <p>Offer Id: {o.id}</p>
                    <Input
                      type='text'
                      placeholder='Offer details'
                      name='offerDetails'
                      value={o.offerDetails}
                      onChange={(e) => this.handleOfferChange(e, o)}
                      // error={errors.label}
                    />
                    <Input
                      type='text'
                      placeholder='Price'
                      name='price'
                      value={o.price}
                      onChange={(e) => this.handleOfferChange(e, o)}
                      // error={errors.label}
                    />
                    <div className='linee'></div>
                  </div>
                  <button onClick={() => this.removeOffer(o)}>
                    <i className='far fa-trash-alt'></i>
                  </button>
                </div>
              ))}
              {offers.length < 5 && (
                <button className='login-btn' onClick={this.addOffer}>
                  Add Offer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddNewProduct;
