# Imports:
from pydantic import BaseModel

# Classe para a tipagem da metricas de venda
class VendasProdutoResponse(BaseModel):
    quantidade_vendida: int
    receita_total: float
    frete_total: float
    ticket_medio: float
