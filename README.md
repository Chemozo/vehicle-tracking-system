# Vehicle Tracking System

## Requirements

### Backend
- Python 3.8+
- Django 4.2+
- Django REST Framework

### Frontend
- Node.js 16+
- npm 8+
- Mapbox API key

## Setup Instructions

### Backend Setup

1. Create and activate virtual environment (optional):
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Create a superuser:
```bash
python manage.py createsuperuser
```

5. Start the development server:
```bash
python manage.py runserver
```

The backend will be available at http://localhost:8000

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env.local` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000/api
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/token/` - Obtain JWT token
```bash
curl --location --request POST '{url}/api/token/' \
--form 'username="{username}"' \
--form 'password="{password}"'
```
- POST `/api/token/refresh/` - Refresh JWT token
```bash
curl --location '{url}/api/token/refresh' \
--form 'refresh="{token}"' \
```

### Users
- POST `/api/token/` - Create a new user
```bash
curl --location '{url}/api/register/' \
--form 'username="{username}"' \
--form 'password="{password}"'
```


### Vehicles
- GET `/api/vehicles/` - List all vehicles
```bash
curl --location --request GET 'http://localhost:8000/api/vehicles/' \
--header 'Authorization: ••••••' \
```

- POST `/api/vehicles/` - Create a new vehicle
```bash
curl --location --request POST 'http://localhost:8000/api/vehicles/' \
--header 'Authorization: ••••••' \
--form 'plate_number="{plate_number}"' \
--form 'latitude="{latitude}"' \
--form 'longitude="-{longitude}"'
```

- GET `/api/vehicles/{id}/` - Retrieve a vehicle
```bash
curl --location --request GET 'http://localhost:8000/api/vehicles/{id}' \
--header 'Authorization: ••••••' \
```
- PUT `/api/vehicles/{id}/` - Update a vehicle
```bash
curl --location --request PUT 'http://localhost:8000/api/vehicles/{id}' \
--header 'Authorization: ••••••' \
--form 'plate_number="{plate_number}"' \
--form 'latitude="{latitude}"' \
--form 'longitude="-{longitude}"'
```
- DELETE `/api/vehicles/{id}/` - Delete a vehicle
```bash
curl --location --request DELETE 'http://localhost:8000/api/vehicles/{id}' \
--header 'Authorization: ••••••' \
```

## Environment Variables

### Frontend
Required environment variables:
- `VITE_API_URL` - Backend API URL
- `VITE_MAPBOX_TOKEN` - Mapbox access token


## License

This project is licensed under the MIT License.
