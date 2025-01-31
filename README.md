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

1. Move to folder:

```bash
cd ..\frontend
```

2. Install dependencies:

```bash
cd frontend
npm install
```

3. Create `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

4. Start the development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:5173

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
curl --location --request GET '{url}/api/vehicles/' \
--header 'Authorization: ••••••' \
```

- POST `/api/vehicles/` - Create a new vehicle

```bash
curl --location --request POST '{url}/api/vehicles/' \
--header 'Authorization: ••••••' \
--form 'plate_number="{plate_number}"' \
--form 'latitude="{latitude}"' \
--form 'longitude="-{longitude}"'
```

- GET `/api/vehicles/{id}/` - Retrieve a vehicle

```bash
curl --location --request GET '{url}/api/vehicles/{id}' \
--header 'Authorization: ••••••' \
```

- PUT `/api/vehicles/{id}/` - Update a vehicle

```bash
curl --location --request PUT '{url}/api/vehicles/{id}' \
--header 'Authorization: ••••••' \
--form 'plate_number="{plate_number}"' \
--form 'latitude="{latitude}"' \
--form 'longitude="-{longitude}"'
```

- DELETE `/api/vehicles/{id}/` - Delete a vehicle

```bash
curl --location --request DELETE '{url}/api/vehicles/{id}' \
--header 'Authorization: ••••••' \
```

## Environment Variables

### Frontend

Required environment variables:

- `VITE_API_URL` - Backend API URL
- `VITE_MAPBOX_TOKEN` - Mapbox access token

### Backend

Required environment variables:

- `DEBUG`- True | False - For development or production

#### Database Variables

- `DB_NAMEaw`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`

## Production Deployment

For production deployment:

### Backend

Deployment to [pythonanywhere.com](https://www.pythonanywhere.com/)

1. Go tu user dashboard
2. Navigate to consoles tab
3. Open a bash console
4. Follow instructions below:

   > https://help.pythonanywhere.com/pages/DeployExistingDjangoProject/

5. From dashboard navigate to Databases
6. Create new database
7. Follow instructions to add environment variables:
   > https://help.pythonanywhere.com/pages/environment-variables-for-web-apps/

**NOTES**

> Ensure environmental variables are set up in both WSGI and .env files.\
> Even though .env files are not recomended for production they were used for compatibility with pythonanywhere.

8.  Go back to the bash console

```bash
# Run Migrations
./manage.py migrate

# Collect static files
./manage.py collectstatic
```

9.  Reload Your Web App

### Frontend

- Deployment to [Vercel.com](https://vercel.com/):

```bash
# Install Vercel CLI if you haven't already
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel
```

- Once deployed add required enviroment variables

  > Vercel loads variables from .env, so if the endpoint is already pointing to production, it doesn't need to be added.

- https://vercel.com/docs/projects/environment-variables
- https://vercel.com/docs/projects/environment-variables/managing-environment-variables

## License

This project is licensed under the MIT License.
