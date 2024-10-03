import Client from "./client";
import { AxiosResponse } from "axios";
import axios from "axios";


// Rakuten APIのエンドポイント
const RAKUTEN_API_URL = "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601";

// APIキー（環境変数を使用することを推奨）
const APPLICATION_ID = "1026980619997350105";

interface RakutenResponse {
  Items: Array<{
    Item: {
      itemName: string;
      itemPrice: number;
      itemUrl: string;
      mediumImageUrls: Array<{ imageUrl: string }>;
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