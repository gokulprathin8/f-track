from datetime import datetime
from enum import Enum
from typing import Set

from beanie import Document, init_beanie, Link
from bson import ObjectId
from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from starlette.requests import Request
from starlette.responses import HTMLResponse
from starlette.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

templates = Jinja2Templates(directory="templates")


origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CategoryType(int, Enum):
    income = 0
    expenditure = 1


class AccountType(int, Enum):
    checking = 0
    saving = 1
    credit = 2


class Categories(Document):
    name: str
    cat_type: CategoryType


class Accounts(Document):
    name: str
    acc_type: AccountType
    balance: int


class Transactions(Document):
    trans_date: datetime
    category: Link[Categories]
    description: str
    account: Link[Accounts]
    amount: int


class TransactionsIn(BaseModel):
    trans_date: datetime
    category: Categories
    description: str
    account: Accounts
    amount: int


class CreateCategoryIn(BaseModel):
    name: str
    cat_type: CategoryType


class AccountsIn(BaseModel):
    name: str
    acc_type: AccountType
    balance: int


@app.post("/create_category")
async def create_category(category: CreateCategoryIn):
    new_cat = Categories(
        name=category.name,
        cat_type=category.cat_type
    )
    await new_cat.insert()


@app.put("/update_category/{category_id}")
async def update_category(category_id: str, category: CreateCategoryIn):
    # Fetch the existing category
    existing_cat = await Categories.get_or_none(id=ObjectId(category_id))
    if not existing_cat:
        raise HTTPException(status_code=404, detail="Category not found")

    # Update the category fields
    existing_cat.name = category.name
    existing_cat.cat_type = category.cat_type
    await existing_cat.replace()
    return {"message": "Category updated successfully"}


@app.delete("/delete_category/{category_id}")
async def delete_category(category_id: str):
    # Fetch the existing category
    existing_cat = await Categories.get_or_none(id=ObjectId(category_id))
    if not existing_cat:
        raise HTTPException(status_code=404, detail="Category not found")

    # Delete the category
    await existing_cat.delete()
    return {"message": "Category deleted successfully"}


@app.post("/create_transaction")
async def create_transaction(trans: TransactionsIn):
    new_trans = Transactions(
        trans_date=trans.trans_date,
        category=trans.category.id,
        description=trans.description,
        account=trans.account.id,
        amount=trans.amount
    )
    await new_trans.insert()
    return {"message": "Transaction created successfully"}


@app.put("/update_transaction/{trans_id}")
async def update_transaction(trans_id: str, trans: TransactionsIn):
    existing_trans = await Transactions.get_or_none(id=ObjectId(trans_id))
    if not existing_trans:
        raise HTTPException(status_code=404, detail="Transaction not found")
    existing_trans.trans_date = trans.trans_date
    existing_trans.category = trans.category.id
    existing_trans.description = trans.description
    existing_trans.account = trans.account.id
    existing_trans.amount = trans.amount
    await existing_trans.replace()
    return {"message": "Transaction updated successfully"}


@app.delete("/delete_transaction/{trans_id}")
async def delete_transaction(trans_id: str):
    existing_trans = await Transactions.get_or_none(id=ObjectId(trans_id))
    if not existing_trans:
        raise HTTPException(status_code=404, detail="Transaction not found")
    await existing_trans.delete()
    return {"message": "Transaction deleted successfully"}


@app.get("/accounts")
async def get_all_accounts():
    accounts = await Accounts.all().to_list()
    return accounts


@app.post("/create_account")
async def create_account(account: AccountsIn):
    new_account = Accounts(
        name=account.name,
        acc_type=account.acc_type,
        balance=account.balance
    )
    await new_account.insert()
    return {"message": "Account created successfully"}


@app.put("/update_account/{account_id}")
async def update_account(account_id: str, account: Accounts):
    # Fetch the existing account
    acc = await Accounts.get(account_id)
    if not acc:
        raise HTTPException(status_code=404, detail="Account not found")
    acc.acc_type = account.acc_type
    acc.name = account.name
    acc.balance = account.balance

    await acc.replace()
    return {"message": "Account updated successfully"}


@app.delete("/delete_account/{account_id}")
async def delete_account(account_id: str):
    existing_account = await Accounts.get(account_id)
    if not existing_account:
        raise HTTPException(status_code=404, detail="Account not found")

    # Delete the account
    await existing_account.delete()
    return {"message": "Account deleted successfully"}

@app.on_event("startup")
async def handle_startup():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    await init_beanie(database=client.db_name, document_models=[Categories, Transactions, Accounts])


@app.get("/home", response_class=HTMLResponse)
async def homepage(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
