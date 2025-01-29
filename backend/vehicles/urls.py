from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, register_user

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet, basename='vehicle')

urlpatterns = [
    path('register/', register_user, name='register'),
    path('', include(router.urls)),
]