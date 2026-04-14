# Imports:
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.produto import Produto
from app.models.item_pedido import ItemPedido
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.schemas.produto import ProdutoCreate, ProdutoUpdate
import uuid
from app.models.item_pedido import ItemPedido

# Produtos:

"""Retorno dos produtos"""
def get_produtos(db: Session, skip: int = 0, limit: int = 20):
    return db.query(Produto).offset(skip).limit(limit).all()

"""Retorno dos produtos por id"""
def get_produto(db: Session, id_produto: str):
    return db.query(Produto).filter(Produto.id_produto == id_produto).first()

"""Busca dos produtos"""
def search_produtos(db: Session, q: str):
    termo = f"%{q}%"
    return db.query(Produto).filter(
        Produto.nome_produto.ilike(termo) |
        Produto.categoria_produto.ilike(termo)
    ).all()

"""Criacao dos produtos"""
def create_produto(db: Session, produto: ProdutoCreate):
    db_produto = Produto(
        id_produto=uuid.uuid4().hex,
        **produto.model_dump()
    )
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto

"""Atualizacao dos produtos"""
def update_produto(db: Session, id_produto: str, dados: ProdutoUpdate):
    produto = get_produto(db, id_produto)
    if not produto:
        return None
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(produto, campo, valor)
    db.commit()
    db.refresh(produto)
    return produto

"""Delecao de produtos"""
def delete_produto(db: Session, id_produto: str):
    produto = get_produto(db, id_produto)
    if not produto:
        return None
    db.delete(produto)
    db.commit()
    return produto

# Avaliacoes:

"""Obtencao das avaliacoes do produto"""
def get_avaliacoes_por_produto(db: Session, id_produto: str):
    avaliacoes = (
        db.query(AvaliacaoPedido)
        .join(ItemPedido, ItemPedido.id_pedido == AvaliacaoPedido.id_pedido)
        .filter(ItemPedido.id_produto == id_produto)
        .all()
    )
    return avaliacoes

"""Obtencao da media das avaliacoes do produto"""
def get_media_avaliacoes(db: Session, id_produto: str):
    resultado = (
        db.query(func.avg(AvaliacaoPedido.avaliacao))
        .join(ItemPedido, ItemPedido.id_pedido == AvaliacaoPedido.id_pedido)
        .filter(ItemPedido.id_produto == id_produto)
        .scalar()
    )
    return round(resultado, 2) if resultado else 0.0

"""Obtencao dao numero de vendas por produto"""
def get_vendas_por_produto(db: Session, id_produto: str):
    itens = (
        db.query(ItemPedido)
        .filter(ItemPedido.id_produto == id_produto)
        .all()
    )
    quantidade = len(itens)
    receita = sum(item.preco_BRL for item in itens)
    frete = sum(item.preco_frete for item in itens)
    ticket = receita / quantidade if quantidade > 0 else 0.0

    return {
        "quantidade_vendida": quantidade,
        "receita_total": round(receita, 2),
        "frete_total": round(frete, 2),
        "ticket_medio": round(ticket, 2),
    }

# Listagem de produtos:

"""Obtencao do total de produtos"""
def get_total_produtos(db: Session, q: str = '') -> int:
    query = db.query(Produto)
    if q:
        termo = f"%{q}%"
        query = query.filter(
            Produto.nome_produto.ilike(termo) |
            Produto.categoria_produto.ilike(termo)
        )
    return query.count()
