from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.produto import Produto
from app.models.item_pedido import ItemPedido
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.schemas.produto import ProdutoCreate, ProdutoUpdate
import uuid

# Produtos:

def get_produtos(db: Session, skip: int = 0, limit: int = 20):
    return db.query(Produto).offset(skip).limit(limit).all()

def get_produto(db: Session, id_produto: str):
    return db.query(Produto).filter(Produto.id_produto == id_produto).first()

def search_produtos(db: Session, q: str):
    termo = f"%{q}%"
    return db.query(Produto).filter(
        Produto.nome_produto.ilike(termo) |
        Produto.categoria_produto.ilike(termo)
    ).all()

def create_produto(db: Session, produto: ProdutoCreate):
    db_produto = Produto(
        id_produto=uuid.uuid4().hex,
        **produto.model_dump()
    )
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto

def update_produto(db: Session, id_produto: str, dados: ProdutoUpdate):
    produto = get_produto(db, id_produto)
    if not produto:
        return None
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(produto, campo, valor)
    db.commit()
    db.refresh(produto)
    return produto

def delete_produto(db: Session, id_produto: str):
    produto = get_produto(db, id_produto)
    if not produto:
        return None
    db.delete(produto)
    db.commit()
    return produto

# Avaliacoes:

def get_avaliacoes_por_produto(db: Session, id_produto: str):
    avaliacoes = (
        db.query(AvaliacaoPedido)
        .join(ItemPedido, ItemPedido.id_pedido == AvaliacaoPedido.id_pedido)
        .filter(ItemPedido.id_produto == id_produto)
        .all()
    )
    return avaliacoes

def get_media_avaliacoes(db: Session, id_produto: str):
    resultado = (
        db.query(func.avg(AvaliacaoPedido.avaliacao))
        .join(ItemPedido, ItemPedido.id_pedido == AvaliacaoPedido.id_pedido)
        .filter(ItemPedido.id_produto == id_produto)
        .scalar()
    )
    return round(resultado, 2) if resultado else 0.0