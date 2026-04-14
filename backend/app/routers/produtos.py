# Imports:
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.produto import ProdutoCreate, ProdutoUpdate, ProdutoResponse, PaginacaoResponse
from app.schemas.avaliacao_pedido import AvaliacaoProdutoResponse
from app.schemas.venda import VendasProdutoResponse
from app import crud

# Definição da rota para os produtos:
router = APIRouter(prefix="/produtos", tags=["Produtos"])

"""Função para a listagem dos produtos """
@router.get("/", response_model=PaginacaoResponse)
def listar_produtos(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    produtos = crud.get_produtos(db, skip=skip, limit=limit)
    total = crud.get_total_produtos(db)
    pagina_atual = skip // limit
    total_paginas = -(-total // limit)
    return {
        "produtos": produtos,
        "total": total,
        "pagina": pagina_atual,
        "total_paginas": total_paginas,
    }

"""Função para a busca dos produtos"""
@router.get("/search", response_model=list[ProdutoResponse])
def buscar_produtos(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    return crud.search_produtos(db, q)

"""Função para obter o detalhamento do produto"""
@router.get("/{id_produto}", response_model=ProdutoResponse)
def detalhar_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = crud.get_produto(db, id_produto)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto

"""Função para obter as avaliacoes do produto"""
@router.get("/{id_produto}/avaliacoes", response_model=AvaliacaoProdutoResponse)
def avaliacoes_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = crud.get_produto(db, id_produto)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    avaliacoes = crud.get_avaliacoes_por_produto(db, id_produto)
    media = crud.get_media_avaliacoes(db, id_produto)
    return {
        "avaliacoes": avaliacoes,
        "media": media,
        "total": len(avaliacoes)
    }

"""Função para obter as vendas do produto"""
@router.get("/{id_produto}/vendas", response_model=VendasProdutoResponse)
def vendas_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = crud.get_produto(db, id_produto)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return crud.get_vendas_por_produto(db, id_produto)

"""Função para permitir a criacao de um produto"""
@router.post("/", response_model=ProdutoResponse, status_code=201)
def criar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    return crud.create_produto(db, produto)

"""Função para permitir a atualizacao de um produto"""
@router.put("/{id_produto}", response_model=ProdutoResponse)
def atualizar_produto(
    id_produto: str,
    dados: ProdutoUpdate,
    db: Session = Depends(get_db)
):
    produto = crud.update_produto(db, id_produto, dados)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto

"""Função para realizar a delecao de um produto"""
@router.delete("/{id_produto}", status_code=204)
def deletar_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = crud.delete_produto(db, id_produto)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
