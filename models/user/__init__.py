#!/usr/bin/env python3
"""Defines User class"""

from typing import Dict
from models.base_model import Base, BaseModel
from sqlalchemy import (
    Column, String, Enum
)
from models.user.auth import UserAuth
from models.enums import UserRole
from sqlalchemy.orm import relationship


class User(BaseModel, Base, UserAuth):
    """Users class"""
    __tablename__ = "users"

    firstname = Column(String(255), nullable=False)
    lastname = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    role = Column(Enum(UserRole), default=UserRole.user,
                  nullable=False)

    @property
    def name(self) -> str:
        """Returns User fullname"""
        return '{} {}'.format(self.firstname, self.lastname)

    def to_dict(self, detailed=False) -> Dict[str, str]:
        """Overrides parent's defualt"""
        obj = super().to_dict()

        # level - 1 heldback attributes
        attrs = ['_password', 'reset_token', 'role']
        for attr in attrs:
            if attr in obj:
                obj.pop(attr)

        if detailed is True:
            return obj

        # level - 3 heldback attributes
        attrs = ['created_at', 'updated_at', 'email']
        for attr in attrs:
            if attr in obj:
                obj.pop(attr)

        return obj