from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

class Vehicle(models.Model):
    id = models.AutoField(primary_key=True)
    plate_number = models.CharField(max_length=20)
    latitude = models.FloatField(validators=[MaxValueValidator(90), MinValueValidator(-90)])
    longitude = models.FloatField(validators=[MaxValueValidator(180), MinValueValidator(-180)])
    last_updated = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicles')

    def __str__(self):
        return f"{self.plate_number} | {self.owner.username}"
