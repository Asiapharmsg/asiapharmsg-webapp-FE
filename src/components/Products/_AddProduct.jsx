import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { useFetchCategories } from '../../hooks/category';
import { useAddProduct } from '../../hooks/products';
import { useSelector } from "react-redux";


const addProductSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  ingredients: yup.string().required('Ingredients is required'),
  price_tier_1: yup
    .number()
    .typeError('Price Tier 1 must be a number')
    .required('Price Tier 1 is required')
    .test(
      'maxDigitsAfterDecimal',
      'Price Tier 1 field must have 2 digits after decimal or less',
      (number) => /^\d+(\.\d{1,2})?$/.test(number)
    ),
  price_tier_2: yup
    .number()
    .typeError('Price Tier 2 must be a number')
    .required('Price Tier 2 is required')
    .test(
      'maxDigitsAfterDecimal',
      'Price Tier 2 field must have 2 digits after decimal or less',
      (number) => /^\d+(\.\d{1,2})?$/.test(number)
    ),
  price_tier_3: yup
    .number()
    .typeError('Price Tier 3 must be a number')
    .required('Price Tier 3 is required')
    .test(
      'maxDigitsAfterDecimal',
      'Price Tier 1 field must have 2 digits after decimal or less',
      (number) => /^\d+(\.\d{1,2})?$/.test(number)
    ),
});

export default function _AddProduct({ onFinishAdding }) {
  const [inventoryCount, setInventoryCount] = useState('1');
  const [unitMeasurement, setUnitMeasurement] = useState('1');
  const [status, setStatus] = useState('1');
  const [expiryDate, setExpiryDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [image, setImage] = useState(null);
  const [sub_image1, setImage1] = useState(null);
  const [sub_image2, setImage2] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const user = useSelector((state) => state.user);

  const { mutate: addProductQuery, isLoading } = useAddProduct();

  const { data: categories } = useFetchCategories();

  useEffect(() => {
    if (categories?.length > 0) {
      setCategoryId(categories[0]?.id);
    }
  }, [categories]);

  const initialValues = {
    name: '',
    description: '',
    ingredients:'',
    price_tier_1: '',
    price_tier_2: '',
    price_tier_3: '',
    remarks: '',
  };

  //Assign Supplier id 
  let supplier_no = "";
  if (user.accountType === 'vendor')
  {

    console.log("Check supplier id  product jsx -- ",user);
    supplier_no = user.supplierId;
  }

  const addProductHandler = (values, actions) => {
    if (!image || !categoryId || !expiryDate || !status || !inventoryCount || !unitMeasurement) {
      alert('All fields are required');
      return;
    }
    const {
      name,
      description,
      ingredients,
      price_tier_1,
      price_tier_2,
      price_tier_3,
      remarks,
    } = values;

    try{
      let formData = new FormData();
      console.log("addproduct handler ", name);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('ingredients', ingredients);
      formData.append('category_id', categoryId);
      formData.append('supplier_id', supplier_no);

      formData.append('price_tier_1', price_tier_1);
      formData.append('price_tier_2', price_tier_2);
      formData.append('price_tier_3', price_tier_3);
      formData.append('unit_measurement', unitMeasurement);
      formData.append('remarks', remarks);
    
      formData.append('expiry_date', expiryDate);
      formData.append('inventory_count', inventoryCount);
      formData.append('status', 1); //Hardcode 
      // Only chosen files are sent, each tagged with the column it fills,
      // so choosing only a secondary image never replaces the primary one.
      [['image', image], ['sub_image1', sub_image1], ['sub_image2', sub_image2]].forEach(
        ([slot, file]) => {
          if (file) {
            formData.append('image_slots', slot);
            formData.append('images', file);
          }
        }
      );

      console.log("data in add project jsx", formData);
      addProductQuery(formData);
    
      actions.resetForm();
      console.log("addproduct - onfinishadding", onFinishAdding);
      onFinishAdding();
    }
    catch(error)
    {
      console.log(error);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={addProductSchema}
      onSubmit={(values, actions) => {
        addProductHandler(values, actions);
      }}
    >
      {({
        values,
        touched,
        errors,
        isValid,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <div className='my-account-area__content'>
          <h3>Add Product</h3>
          <div className='account-details-form'>
            {isLoading && <div>Loading ...</div>}
            {!isLoading && (
              <form>
                <Row>
                  <Col lg={6}>
                    <div className='single-input-item'>
                      <label htmlFor='name' className='required'>
                        Name
                      </label>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p style={{ color: 'red', fontSize: '12px' }}>
                        {touched.name && errors.name}
                      </p>
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className='single-input-item'>
                      <label htmlFor='category' className='required'>
                        Category
                      </label>
                      <select
                        type='text'
                        id='last-name'
                        style={{
                          width: '100%',
                          height: '50px',
                          border: '1px solid #e8e8e8',
                          padding: '10px',
                        }}
                        onChange={(e) => setCategoryId(e.target.value)}
                      >
                        {categories?.map((cat) => (
                          <option value={cat?.id}>{cat?.name}</option>
                        ))}
                      </select>
                    </div>
                  </Col>
                </Row>
                <div className='single-input-item'>
                  <label htmlFor='display-name' className='required'>
                    Description
                  </label>
                  <textarea
                    type='text'
                    id='display-name'
                    style={{
                      width: '100%',
                      height: '100px',
                      border: '1px solid #e8e8e8',
                      padding: '10px',
                    }}
                    name='description'
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <p style={{ color: 'red', fontSize: '12px' }}>
                    {touched.description && errors.description}
                  </p>
                </div>
                <div className='single-input-item'>
                  <label htmlFor='display-name' className='required'>
                    Ingredients
                  </label>
                  <textarea
                    type='text'
                    id='display-name'
                    style={{
                      width: '100%',
                      height: '100px',
                      border: '1px solid #e8e8e8',
                      padding: '10px',
                    }}
                    name='ingredients'
                    value={values.ingredients}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <p style={{ color: 'red', fontSize: '12px' }}>
                    {touched.ingredients && errors.ingredients}
                  </p>
                </div>
                <Row>
                  <Col lg={4}>
                    <div className='single-input-item'>
                      <label htmlFor='price_tier_1' className='required'>
                        Price Tier 1
                      </label>
                      <input
                        type='number'
                        id='name'
                        name='price_tier_1'
                        value={values.price_tier_1}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p style={{ color: 'red', fontSize: '12px' }}>
                        {touched.price_tier_1 && errors.price_tier_1}
                      </p>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className='single-input-item'>
                      <label htmlFor='price_tier_2' className='required'>
                        Price Tier 2
                      </label>
                      <input
                        type='number'
                        id='name'
                        name='price_tier_2'
                        value={values.price_tier_2}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p style={{ color: 'red', fontSize: '12px' }}>
                        {touched.price_tier_2 && errors.price_tier_2}
                      </p>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className='single-input-item'>
                      <label htmlFor='price_tier_3' className='required'>
                        Price Tier 3
                      </label>
                      <input
                        type='number'
                        id='name'
                        name='price_tier_3'
                        value={values.price_tier_3}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p style={{ color: 'red', fontSize: '12px' }}>
                        {touched.price_tier_3 && errors.price_tier_3}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={4}>
                    <div className='single-input-item'>
                      <label htmlFor='inventoryCount' className='required'>
                        Inventory count
                      </label>
                      <select
                        type='text'
                        id='last-name'
                        style={{
                          width: '100%',
                          height: '50px',
                          border: '1px solid #e8e8e8',
                          padding: '10px',
                        }}
                        value={inventoryCount}
                        onChange={(e) => setInventoryCount(e.target.value)}
                      >
                        <option value='0'>Out of Stock</option>
                        <option value='1'>Available</option>
                        <option value='2'>Indent</option>
                      </select>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className='single-input-item'>
                      <label htmlFor='unitMeasurement' className='required'>
                        Unit Measurement
                      </label>
                      <select
                        type='text'
                        id='unitMeasurement'
                        style={{
                          width: '100%',
                          height: '50px',
                          border: '1px solid #e8e8e8',
                          padding: '10px',
                        }}
                        value={unitMeasurement}
                        onChange={(e) => setUnitMeasurement(e.target.value)}
                      >
                        <option value='0'>Bottle</option>
                        <option value='1'>Box</option>
                        <option value='2'>Packet</option>
                        <option value='3'>Piece</option>
                        <option value='4'>Sachet</option>
                        <option value='5'>Ampoule</option>
                        <option value='6'>Vial</option>
                        <option value='7'>Bag</option>
                        <option value='8'>Tube</option>
                        <option value='9'>Unit</option>
                        <option value='10'>Set</option>
                        <option value='11'>Strip</option>
                        <option value='12'>Jar</option>
                        <option value='13'>Tub</option>
                        <option value='14'>Carton</option>
                        <option value='15'>Can</option>
                        <option value='16'>Cannister</option>
                        <option value='17'>Case</option>
                        <option value='18'>Container</option>
                        <option value='19'>Each</option>
                        <option value='20'>Roll</option>
                        <option value='99'>Invalid</option>
                      </select>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className='single-input-item'>
                      <label htmlFor='remarks' className='required'>
                        Remarks
                      </label>
                      <textarea
                        type='text'
                        id='remarks'
                        style={{
                          width: '100%',
                          height: '50px',
                          border: '1px solid #e8e8e8',
                          padding: '10px',
                        }}
                        name='remarks'
                        value={values.remarks}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                  </Col>
                </Row>
                <div className='single-input-item'>
                  <label htmlFor='image1' className='required'>
                    Primary Product Image
                  </label>
                  <input
                    type='file'
                    id='display-name'
                    accept='image/png, image/gif, image/jpeg'
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <div className='single-input-item'>
                  <label htmlFor='image2' className='required'>
                    Secondary Product Image 1
                  </label>
                  <input
                    type='file'
                    id='display-name'
                    accept='image/png, image/gif, image/jpeg'
                    onChange={(e) => setImage1(e.target.files[0])}
                  />
                </div>
                <div className='single-input-item'>
                  <label htmlFor='image3' className='required'>
                    Secondary Product Image 2
                  </label>
                  <input
                    type='file'
                    id='display-name'
                    accept='image/png, image/gif, image/jpeg'
                    onChange={(e) => setImage2(e.target.files[0])}
                  />
                </div>
                <div className='single-input-item'>
                  <label htmlFor='expiryDate' className='required'>
                    Expiry date
                  </label>
                  <input
                    type='date'
                    id='display-name'
                    min={dayjs().format('YYYY-MM-DD')}
                    defaultValue={expiryDate}
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <div className='single-input-item'>
                  <button
                    type='submit'
                    style={!isValid ? {opacity: '0.5'} : {}}
                    disabled={!isValid}
                    onClick={handleSubmit}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Formik>
  );
}
