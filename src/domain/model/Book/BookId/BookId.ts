import { ValueObject } from "../../shared/ValueObject";

export class BookId extends ValueObject<string, "BookId"> {
  static readonly MAX_LENGTH = 13;
  static readonly MIN_LENGTH = 10;

  constructor(value: string) {
    super(value);
  }

  protected validate(isbn: string): void {
    if (isbn.length < BookId.MIN_LENGTH || isbn.length > BookId.MAX_LENGTH) {
      throw new Error("ISBNの文字数が不正です");
    }

    if (!this.isValidIsbn10(isbn) && !this.isValidIsbn13(isbn)) {
      throw new Error("不正なISBNの形式です");
    }
  }

  private isValidIsbn10(isbn10: string): boolean {
    if (isbn10.length !== 10) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += (10 - i) * parseInt(isbn10.charAt(i), 10);
    }
    let checksum = isbn10.charAt(9).toUpperCase();
    sum += checksum === "X" ? 10 : parseInt(checksum, 10);
    return sum % 11 === 0;
  }

  private isValidIsbn13(isbn13: string): boolean {
    if (
      isbn13.length !== 13 ||
      (!isbn13.startsWith("978") && !isbn13.startsWith("979"))
    )
      return false;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(isbn13.charAt(i), 10) * (i % 2 === 0 ? 1 : 3);
    }
    let checksum = (10 - (sum % 10)) % 10;
    return checksum === parseInt(isbn13.charAt(12), 10);
  }

  toISBN(): string {
    if (this._value.length === 10) {
      // ISBNが10桁の場合の、'ISBN' フォーマットに変換します。
      const groupIdentifier = this._value.substring(0, 1); // 国コードなど（1桁）
      const publisherCode = this._value.substring(1, 3); // 出版者コード（2桁）
      const bookCode = this._value.substring(3, 9); // 書籍コード（6桁）
      const checksum = this._value.substring(9); // チェックディジット（1桁）

      return `ISBN${groupIdentifier}-${publisherCode}-${bookCode}-${checksum}`;
    } else {
      // ISBNが13桁の場合の、'ISBN' フォーマットに変換します。
      const isbnPrefix = this._value.substring(0, 3); // 最初の3桁 (978 または 979)
      const groupIdentifier = this._value.substring(3, 4); // 国コードなど（1桁）
      const publisherCode = this._value.substring(4, 6); // 出版者コード（2桁）
      const bookCode = this._value.substring(6, 12); // 書籍コード（6桁）
      const checksum = this._value.substring(12); // チェックディジット（1桁）

      return `ISBN${isbnPrefix}-${groupIdentifier}-${publisherCode}-${bookCode}-${checksum}`;
    }
  }
}
