//export const BASE_URL = 'https://api.asiapharmsg.com/';
export const BASE_URL = process.env.API_URL;

// fetch() with the login token attached. All /api calls go through this so
// the backend can require authentication on them.
export const apiFetch = (url, options = {}) => {
  const headers = new Headers(options.headers || {});
  if (typeof window !== 'undefined' && !headers.has('Authorization')) {
    const token = localStorage.getItem('token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(url, { ...options, headers });
};

// Address printed on an order. Delivery type 2 means "use the separate
// delivery address"; accounts without one fall back to the company address.
export const buildDeliveryAddress = (userData, deliveryType) => {
  const hasDeliveryAddress =
    userData?.deliveryAddress && String(userData.deliveryAddress).trim() !== '';
  const useDelivery = String(deliveryType) === '2' && hasDeliveryAddress;
  const address = useDelivery
    ? userData.deliveryAddress
    : userData?.companyAddress;
  const postal = useDelivery ? userData.deliveryPostal : userData?.companyPostal;
  return `${address ?? ''} Singapore ${postal ?? ''}`.trim();
};
//export const SUPPLIER_ID = 8;
//export const USER_ID = 7;

export const getStockCount = (inventoryCount) => {
  switch (String(inventoryCount)) {
    case '0':
      return 'Out of Stock';
    case '1':
      return 'Available';
    case '2':
      return 'Indent';
    default:
      return '';
  }
};

export const getUnitMeasurement = (unitMeasurement) => {
  switch (String(unitMeasurement)) {
    case '0':
      return 'Bottle';
    case '1':
      return 'Box';
    case '2':
      return 'Packet';
    case '3':
      return 'Piece';
    case '4':
      return 'Sachet';
    case '5':
      return 'Ampoule';
    case '6':
      return 'Vial';
    case '7':
      return 'Bag';
    case '8':
      return 'Tube';
    case '9':
      return 'Unit';
    case '10':
      return 'Set';
    case '11':
      return 'Strip';
    case '12':
      return 'Jar';
    case '13':
      return 'Tub';
    case '14':
      return 'Carton';
    case '15':
      return 'Can';
    case '16':
      return 'Cannister';
    case '17':
      return 'Case';
    case '18':
      return 'Container';
    case '19':
      return 'Each';
    case '20':
      return 'Roll';
    case '99':
      return 'Invalid';
    default:
      return '';
  }
};

export const getProductStatus = (status) => {
  switch (String(status)) {
    case '1':
      return 'Active';
    case '2':
      return 'Pending';
    case '3':
      return 'Rejected';
    case '4':
      return 'Closed';
    default:
      return '';
  }
};

export const getOrderStatus = (status) => {
  switch (String(status)) {
    case '1':
      return 'Approved';
    case '2':
      return 'Pending';
    case '3':
      return 'Rejected';
    case '4':
      return 'Closed';
    case '5':
      return 'Partially Fulfilled';
    case '99':
      return 'Invalid';
    default:
      return '';
  }
};

export const getCompleteOrderStatus = (orderdetails) => {
  if (orderdetails.every((od) => od.status == 1)) return 1;
  else if (orderdetails.every((od) => od.status == 2)) return 2;
  else if (orderdetails.every((od) => od.status == 3)) return 3;
  else return 5;
};
