import axios from "axios";

// Rakuten APIのエンドポイント
const RAKUTEN_API_URL = "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601";

const BACKEND_BASE_URL = "http://localhost:8000";

// APIキー（環境変数を使用することを推奨）
const APPLICATION_ID = "1026980619997350105";

interface RakutenResponse {
  Items: Array<{
    Item: {
      itemName: string;
      itemPrice: number;
      itemUrl: string;
      mediumImageUrls: Array<{ imageUrl: string }>;
      smallImageUrls: Array<{ imageUrl: string }>;
      // 他の必要なフィールドを追加
    };
  }>;
  // 他のフィールドを必要に応じて追加
}

export const searchItems = async (keyword: string): Promise<RakutenResponse | null> => {
  const params = {
    keyword: keyword,
    applicationId: APPLICATION_ID,
    format: 'json',
    // 必要に応じて他のパラメータを追加
  };

  try {
    console.info(`Sending request to ${RAKUTEN_API_URL} with params:`, params);

    const response = await axios.get<RakutenResponse>(RAKUTEN_API_URL, { params });

    console.info(`Received response:`, response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching data from Rakuten API:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};

export const chatSearchItems = async (chat: string) => {
  const params = chat;
  const response = await axios.post(`${BACKEND_BASE_URL}/items/chatai/?prompt=${params}`);

  if (response.status === 200) {
    return response.data;
  }
}

export const chatMessageRequest = async (chat: string) => {
  const params = chat;
  const response = await axios.post(`${BACKEND_BASE_URL}/items/chatmessage/?prompt=${params}`);
  console.log( response.data);

  if (response.status === 200) {
    return response.data;
  }
}

export const saveFavoriteItem = async (username: string, item: any) => {
  const item_code = "testCode";
  const item_name = item.itemName;
  const item_price = item.itemPrice;
  const item_url = item.itemUrl;
  const item_image_url = item.mediumImageUrls[0].imageUrl;

  try {
    const response = await axios.post(`${BACKEND_BASE_URL}/items/favorite/`, {
      username,
      item_code,
      item_name,
      item_price,
      item_url,
      item_image_url
    });
    return response.data;
  } catch (error) {
    console.error('Error saving favorite item:', error);
    return null;
  }
};

export const fetchFavoriteItems = async (username: string) => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/items/favorites/`, {
      params: { username }
    });
    const favoriteItems = response.data.map((item: any) => ({
      itemName: item.item_name,          
      itemPrice: item.item_price,        
      itemUrl: item.item_url,             
      imageUrl: item.item_image_url,     
    }));
    console.log(favoriteItems);
    return favoriteItems;
  } catch (error) {
    console.error('Error fetching favorite item:', error);
    return null;
  }
};

export const deleteFavoriteItem = async (username: string, itemUrl: string) => {
  try {
    const response = await axios.delete(`${BACKEND_BASE_URL}/items/favorites/delete/`, {
      params: { username, item_url: itemUrl }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting favorite item:', error);
    return null;
  }
};