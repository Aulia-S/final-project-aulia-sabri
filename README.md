# Final Project Sanber Batch 57 | Ecommerce App with NodeJS, Express, and MongoDB

## Getting Started
First, install dependencies :

```sh
npm install
```

Then, start the app :

```sh
npm run dev
```

## Api Specification
Base URL : https://final-project-aulia-sabri-production.up.railway.app
Endpoint :

| HTTP Method | URL | Description |
| ------ | ------ | ------ |
| GET | /api | To check server is online |
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get user personal data |
| POST | /api/categories | Create categories |
| GET | /api/categories | Get categories |
| GET | /api/categories/:id | Get category by id |
| PUT | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete category |
| POST | /api/upload | Upload a file |
| POST | /api/uploads | Upload many files |
| POST | /api/products | Create products |
| GET | /api/products | Get products |
| POST | /api/orders | Create orders |
| GET | /api/orders | Get orders |

payload structure for POST /api/orders

```json
{
 "grandTotal": 36000,
 "orderItems": [
    {
        "name": "product1",
        "productId": "668554e4af070499b9c64edf",
        "price": 12000,
        "quantity": 2
    },
    {
        "name": "product2",
        "productId": "6685833c709199daef32d687",
        "price": 12000,
        "quantity": 1
    }
 ],
 "status": "pending"
}
```
