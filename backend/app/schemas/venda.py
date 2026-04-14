from pydantic import BaseModel
class VendasProdutoResponse(BaseModel):
    quantidade_vendida: int
    receita_total: float
    frete_total: float
    ticket_medio: float
