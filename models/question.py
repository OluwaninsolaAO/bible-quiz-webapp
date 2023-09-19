#!/usr/bin/env python3
"""Question Module"""

from models.base_model import BaseModel, Base
from sqlalchemy import Column, Text
from sqlalchemy.orm import relationship
from typing import Dict


class Question(BaseModel, Base):
    """Question Class"""

    __tablename__ = 'questions'

    text = Column(Text, nullable=False)

    answers = relationship('Answer', backref='question',
                           cascade='all, delete-orphan')

    def to_dict(self, detailed=False) -> Dict[str, str]:
        """Overrides parent's defualt"""
        obj = super().to_dict()

        # level - 1 heldback attributes
        attrs = ['answers']
        for attr in attrs:
            if attr in obj:
                obj.pop(attr)

        if detailed is True:
            return obj

        # level - 3 heldback attributes
        attrs = ['created_at', 'updated_at']
        for attr in attrs:
            if attr in obj:
                obj.pop(attr)

        return obj
