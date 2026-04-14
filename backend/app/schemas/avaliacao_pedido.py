# Imports:
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Classe para a tipagem da avaliacao
class AvaliacaoResponse(BaseModel):
    id_avaliacao: str
    id_pedido: str
    avaliacao: int
    titulo_comentario: Optional[str] = None
    comentario: Optional[str] = None
    data_comentario: Optional[datetime] = None
    class Config:
        from_attributes = True

# Classe para a tipagem das metricas das avaliacoes
class AvaliacaoProdutoResponse(BaseModel):
    avaliacoes: list[AvaliacaoResponse]
    media: float
    total: int
