from models.curso import Curso
c = Curso.query.first()
print(c.materias)  # Deve trazer uma lista de Materia