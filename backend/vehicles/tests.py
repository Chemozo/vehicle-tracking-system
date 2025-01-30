from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from .models import Vehicle
from rest_framework import status

class UserRegistrationTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.valid_user_data = {
            'username': 'testuser',
            'password': 'testpass123',
            'email': 'test@example.com'
        }

    def test_valid_registration(self):
        response = self.client.post(self.register_url, self.valid_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_duplicate_username(self):
        # Create a user first
        User.objects.create_user(username='testuser', password='testpass123')
        
        response = self.client.post(self.register_url, self.valid_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertTrue(any('already exists' in str(error) for error in response.data['username']))


class VehicleTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', 
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.vehicle_data = {
            'plate_number': 'ABC123',
            'latitude': 40.7128,
            'longitude': -74.0060
        }
        
        self.vehicle = Vehicle.objects.create(
            plate_number='XYZ789',
            latitude=35.6762,
            longitude=139.6503,
            owner=self.user
        )

    def test_create_vehicle(self):
        url = reverse('vehicle-list')
        response = self.client.post(url, self.vehicle_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vehicle.objects.count(), 2)
        self.assertEqual(Vehicle.objects.get(plate_number='ABC123').owner, self.user)

    def test_list_vehicles(self):
        url = reverse('vehicle-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_vehicle_detail(self):
        url = reverse('vehicle-detail', kwargs={'pk': self.vehicle.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['plate_number'], 'XYZ789')

    def test_update_vehicle(self):
        url = reverse('vehicle-detail', kwargs={'pk': self.vehicle.pk})
        updated_data = {
            'plate_number': 'NEW123',
            'latitude': 51.5074,
            'longitude': -0.1278
        }
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.vehicle.refresh_from_db()
        self.assertEqual(self.vehicle.plate_number, 'NEW123')

    def test_delete_vehicle(self):
        url = reverse('vehicle-detail', kwargs={'pk': self.vehicle.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Vehicle.objects.count(), 0)

    def test_unauthorized_access(self):
        # Create another user and their vehicle
        other_user = User.objects.create_user(username='other', password='pass123')
        other_vehicle = Vehicle.objects.create(
            plate_number='OTHER1',
            latitude=0,
            longitude=0,
            owner=other_user
        )
        
        # Try to access other user's vehicle
        url = reverse('vehicle-detail', kwargs={'pk': other_vehicle.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_coordinates(self):
        invalid_data = {
            'plate_number': 'TEST123',
            'latitude': 91,  # Invalid latitude (> 90)
            'longitude': -74.0060
        }
        url = reverse('vehicle-list')
        response = self.client.post(url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)