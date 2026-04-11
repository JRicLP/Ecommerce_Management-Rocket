import csv
import os
from datetime import datetime
from app.database import SessionLocal
from app.models.consumidor import Consumidor
from app.models.produto import Produto
from app.models.vendedor import Vendedor
from app.models.pedido import Pedido
from app.models.item_pedido import ItemPedido
from app.models.avaliacao_pedido import AvaliacaoPedido

CSV_DIR = os.path.join(os.path.dirname(__file__), "csvs")

def parse_float(value):
    try:
        return float(value) if value and value.strip() else None
    except ValueError:
        return None

def parse_datetime(value):
    try:
        return datetime.fromisoformat(value) if value and value.strip() else None
    except ValueError:
        return None

def parse_date(value):
    try:
        return datetime.strptime(value.strip(), "%Y-%m-%d").date() if value and value.strip() else None
    except ValueError:
        return None

def seed_consumidores(db):
    with open(os.path.join(CSV_DIR, "consumidores.csv"), newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            db.add(Consumidor(
                id_consumidor=row["id_consumidor"],
                prefixo_cep=row["prefixo_cep"],
                nome_consumidor=row["nome_consumidor"],
                cidade=row["cidade"],
                estado=row["estado"],
            ))
    db.commit()
    print("Consumidores inseridos.")

def seed_produtos(db):
    with open(os.path.join(CSV_DIR, "produtos.csv"), newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            db.add(Produto(
                id_produto=row["id_produto"],
                nome_produto=row["nome_produto"],
                categoria_produto=row["categoria_produto"],
                peso_produto_gramas=parse_float(row.get("peso_produto_gramas")),
                comprimento_centimetros=parse_float(row.get("comprimento_centimetros")),
                altura_centimetros=parse_float(row.get("altura_centimetros")),
                largura_centimetros=parse_float(row.get("largura_centimetros")),
            ))
    db.commit()
    print("Produtos inseridos.")

def seed_vendedores(db):
    with open(os.path.join(CSV_DIR, "vendedores.csv"), newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            db.add(Vendedor(
                id_vendedor=row["id_vendedor"],
                nome_vendedor=row["nome_vendedor"],
                prefixo_cep=row["prefixo_cep"],
                cidade=row["cidade"],
                estado=row["estado"],
            ))
    db.commit()
    print("Vendedores inseridos.")

def seed_pedidos(db):
    with open(os.path.join(CSV_DIR, "pedidos.csv"), newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            db.add(Pedido(
                id_pedido=row["id_pedido"],
                id_consumidor=row["id_consumidor"],
                status=row["status"],
                pedido_compra_timestamp=parse_datetime(row.get("pedido_compra_timestamp")),
                pedido_entregue_timestamp=parse_datetime(row.get("pedido_entregue_timestamp")),
                data_estimada_entrega=parse_date(row.get("data_estimada_entrega")),
                tempo_entrega_dias=parse_float(row.get("tempo_entrega_dias")),
                tempo_entrega_estimado_dias=parse_float(row.get("tempo_entrega_estimado_dias")),
                diferenca_entrega_dias=parse_float(row.get("diferenca_entrega_dias")),
                entrega_no_prazo=row.get("entrega_no_prazo"),
            ))
    db.commit()
    print("Pedidos inseridos.")

def seed_itens_pedidos(db):
    with open(os.path.join(CSV_DIR, "itens_pedidos.csv"), newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            db.add(ItemPedido(
                id_pedido=row["id_pedido"],
                id_item=int(row["id_item"]),
                id_produto=row["id_produto"],
                id_vendedor=row["id_vendedor"],
                preco_BRL=parse_float(row["preco_BRL"]),
                preco_frete=parse_float(row["preco_frete"]),
            ))
    db.commit()
    print("Itens de pedidos inseridos.")

def seed_avaliacoes(db):
    inseridos = set()
    ignorados = 0
    with open(os.path.join(CSV_DIR, "avaliacoes_pedidos.csv"), newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            id_ = row["id_avaliacao"]
            if id_ in inseridos:
                ignorados += 1
                continue
            inseridos.add(id_)
            db.add(AvaliacaoPedido(
                id_avaliacao=id_,
                id_pedido=row["id_pedido"],
                avaliacao=int(row["avaliacao"]),
                titulo_comentario=row.get("titulo_comentario") or None,
                comentario=row.get("comentario") or None,
                data_comentario=parse_datetime(row.get("data_comentario")),
                data_resposta=parse_datetime(row.get("data_resposta")),
            ))
    db.commit()
    print(f"Avaliações inseridas. {ignorados} duplicatas ignoradas.")

def main():
    db = SessionLocal()
    try:
        print("Iniciando população do banco...")
        seed_consumidores(db)
        seed_produtos(db)
        seed_vendedores(db)
        seed_pedidos(db)
        seed_itens_pedidos(db)
        seed_avaliacoes(db)
        print("\nBanco populado com sucesso!")
    except Exception as e:
        db.rollback()
        print(f"Erro durante o seed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()