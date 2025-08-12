from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from . import Base

class Resolution(Base):
    __tablename__ = 'resolutions'
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    content_file = Column(String)  # Caminho para o arquivo markdown
    
    missions = relationship("Mission", back_populates="resolution", cascade="all, delete-orphan")
    
class Mission(Base):
    __tablename__ = 'missions'
    
    id = Column(Integer, primary_key=True)
    resolution_id = Column(Integer, ForeignKey('resolutions.id'), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    order = Column(Integer, default=0)  # Ordem da missão
    type = Column(String, nullable=False)  # 'reading', 'quiz', 'fillBlanks', 'matching'
    content = Column(JSON)  # Conteúdo específico do jogo em formato JSON
    completed = Column(Boolean, default=False)
    locked = Column(Boolean, default=False)
    
    resolution = relationship("Resolution", back_populates="missions")