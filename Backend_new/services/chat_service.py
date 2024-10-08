# main.py
import requests
import os
import openai
import json
import logging

logger = logging.getLogger(__name__)

OPENAI_API_KEY="sk-4PIGpM6wSTRQ_FlclvDZDPIisTVVZT3RTu6kdWoNAhT3BlbkFJlgVRXuWQtx_0G-Wa8hhfTFatyzrLtf4zAJlvLYLngA"
RAKUTEN_APPLICATION_ID="1026980619997350105"

# OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
# RAKUTEN_APPLICATION_ID = os.getenv('RAKUTEN_APPLICATION_ID')

def search_rakuten_products(keyword, genreId=None, page=1, hits=None, minPrice=None, maxPrice=None):

    url = "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601"
    params = {
        'applicationId': RAKUTEN_APPLICATION_ID,
        'keyword': keyword,
        'page': page,
        'hits': 10,
        'sort': '-reviewAverage', #reviewAverageで固定
        # 'minPrice': 500,
        # 'maxPrice': 1000,
        'format': 'json'
    }

    if genreId:
        params['genreId'] = genreId
    if minPrice:
        params['minPrice'] = minPrice
    if maxPrice:
        params['maxPrice'] = maxPrice
    if hits:
        params['hits'] = hits


    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"Other error occurred: {err}")

    return None

openai.api_key = OPENAI_API_KEY

# 関数のスキーマを定義
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_rakuten_products",
            "description": "検索キーワードとオプションのパラメータを受け取り、Rakuten Product Search APIを呼び出して商品を検索します。",
            "parameters": {
                "type": "object",
                "properties": {
                    "keyword": {
                        "type": "string",
                        "description": "検索キーワード。空白で何個かのキーワードを指定することもできます。"
                    },
                    "genre_id": {
                        "type": "string",
                        "description": "ジャンルID。指定しない場合は全ジャンルから検索します。"
                    },
                    "page": {
                        "type": "integer",
                        "description": "検索結果のページ番号。デフォルトは1。"
                    },
                    "hits": {
                        "type": "integer",
                        "description": "1ページあたりの取得件数。最小は5で最大は30。商品を多く表示させたい場合は20以上"
                    },
                    "min_price": {
                        "type": "integer",
                        "description": "最低価格。高めの買い物をしたいときはこの数値を上げる。"
                    },
                    "max_price": {
                        "type": "integer",
                        "description": "最高価格。安めの買い物をしたいときはこの数値を下げる。"
                    },
                },
                "required": ["keyword"],
                "additionalProperties": False,
            }
        }
    }
]

def process_user_prompt(user_prompt):
    """
    ユーザーのプロンプトを処理し、Rakuten Product Search APIを呼び出します。

    Args:
        user_prompt (str): ユーザーからのプロンプト。

    Returns:
        dict: Rakuten APIからの検索結果。
    """

    openai.api_key = OPENAI_API_KEY

    response = openai.chat.completions.create(
        model="gpt-4o-mini",  # 最新のFunction Calling対応モデルを指定
        messages=[
            {"role": "system", "content": "You are a helpful assistant. Use the supplied tools to assist the user"},
            {"role": "user", "content": user_prompt}
        ],
        tools=tools,
        # function_call={"name": "search_rakuten_products"}  # 関数を指定
    )
    print(response)


    # レスポンスから関数呼び出しの引数を取得
    if response.choices[0].finish_reason == 'tool_calls':
        tool_call = response.choices[0].message.tool_calls[0]
        print(tool_call)
        args = json.loads(tool_call.function.arguments)
        if args:
            ####test####
            print("openai output this keyword: " + args.get('keyword'))
            # args = json.loads(arguments)
            keyword = args.get('keyword')
            genreId = args.get('genre_id')
            page = args.get('page', 1)
            hits = args.get('hits')
            minPrice = args.get('min_price')
            maxPrice = args.get('max_price')

            # Rakuten APIを呼び出す
            rakuten_data = search_rakuten_products(keyword, genreId, page, hits, minPrice, maxPrice)
            return rakuten_data

    return None

def function_calling(prompt):
    print("Rakuten Product Search with OpenAI Function Calling")
    print("---------------------------------------------------")
    logger.info("prompt is " + prompt)
    print("prompt is " + prompt)

    user_prompt = prompt
    result = process_user_prompt(user_prompt)

    #test
    # result = search_rakuten_products(user_prompt, minPrice=500, maxPrice=2000)

    if result:
        # print(f"\n総ヒット数: {result.get('count')}")
        # print(f"ページ数: {result.get('pageCount')}ページ")
        # print("\n検索結果:")
        # for item in result.get('Items', []):
        #     item_data = item['Item']
        #     print(f"商品名: {item_data.get('itemName')}")
        #     print(f"価格: {item_data.get('itemPrice')}円")
        #     print(f"URL: {item_data.get('itemUrl')}")
        #     if item_data.get('mediumImageUrls'):
        #         print(f"画像URL: {item_data.get('mediumImageUrls')[0].get('imageUrl')}")
        #     print("-" * 40)
        
        return result
    else:
        print("データの取得に失敗しました。")
        return None
    

def chat_bot(prompt):
    print("Rakuten Product Search with OpenAI Chatbot")
    print("---------------------------------------------------")
    logger.info("prompt is " + prompt)

    openai.api_key = OPENAI_API_KEY

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        # messages=[
        #     {"role": "system", "content": "あなたは可愛いキャラクターです．\
        #      ユーザは欲しい商品を検索したいと思っています．それに対して気が利く可愛いコメントを返してください \
        #      コメントは短く端的でお願いします．"
        #      },
        #     {"role": "user", "content": prompt}
        # ]
        messages=[
            {"role": "system", "content": "あなたは20代のトレンドに詳しいキャラクターです．\
             ユーザは主に20代で，欲しい商品を検索したいと思っています．\
             そのほしい商品に対して現在の若者のトレンドが何かを教えてあげるようなコメントを返して下さい． \
             コメントは短く端的で, 可愛い文書でお願いします．例えば「今の若者の中では○○が人気だよ！」のように．○○の中身は適切なものに変えてください"
             },
            {"role": "user", "content": prompt}
        ]
    )

    print(response)

    if response.choices[0].finish_reason == 'completed' or response.choices[0].finish_reason == 'stop':
        return response.choices[0].message.content
    else:
        return None
