export interface CardImage {
  id?: number;
  image_url?: string;
  image_url_small?: string;
  image_url_cropped?: string;
}

export interface CardSet {
  set_name?: string;
  set_code?: string;
  set_rarity?: string;
  set_price?: string;
}

export interface CardPrice {
  cardmarket_price?: string;
  tcgplayer_price?: string;
  ebay_price?: string;
  amazon_price?: string;
  coolstuffinc_price?: string;
}

export interface YuGiOhCard {
  id: number;
  name: string;
  type?: string;
  desc?: string;
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  race?: string;
  archetype?: string;
  typeline?: string[];
  card_images?: CardImage[];
  card_sets?: CardSet[];
  card_prices?: CardPrice[];
  ygoprodeck_url?: string;
}

export interface CardApiResponse {
  data?: YuGiOhCard[];
  error?: string;
}