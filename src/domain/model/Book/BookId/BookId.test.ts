import { BookId } from "./BookId";

describe("BookId", () => {
  let validIsbn13: string;
  let validIsbn10: string;
  const INVALID_ISBN_LENGTH_ERROR = "ISBNの文字数が不正です";
  const INVALID_ISBN_FORMAT_ERROR = "不正なISBNの形式です";

  beforeEach(() => {
    validIsbn13 = "9784167158057";
    validIsbn10 = "4167158051";
  });

  // 正常系
  test("有効な13桁のISBNを正しく変換する", () => {
    expect(new BookId(validIsbn13).value).toBe(validIsbn13);
  });

  test("有効な10桁のISBNを正しく変換する", () => {
    expect(new BookId(validIsbn10).value).toBe(validIsbn10);
  });

  test("同じISBNの場合、equalsメソッドがtrueを返す", () => {
    const bookId1 = new BookId(validIsbn13);
    const bookId2 = new BookId(validIsbn13);
    expect(bookId1.equals(bookId2)).toBeTruthy();
  });

  test("異なるISBNの場合、equalsメソッドがfalseを返す", () => {
    const bookId1 = new BookId(validIsbn13);
    const bookId3 = new BookId(validIsbn10);
    expect(bookId1.equals(bookId3)).toBeFalsy();
  });

  test("13桁のISBNをtoISBNメソッドで正しくフォーマットする", () => {
    const bookId = new BookId(validIsbn13);
    expect(bookId.toISBN()).toBe("ISBN978-4-16-715805-7");
  });

  test("10桁のISBNをtoISBNメソッドで正しくフォーマットする", () => {
    const bookId = new BookId(validIsbn10);
    expect(bookId.toISBN()).toBe("ISBN4-16-715805-1");
  });

  // 異常系
  test("14桁の不正なISBNの場合にエラーを投げる", () => {
    expect(() => new BookId("1".repeat(14))).toThrow(INVALID_ISBN_LENGTH_ERROR);
  });

  test("9桁の不正なISBNの場合にエラーを投げる", () => {
    expect(() => new BookId("1".repeat(9))).toThrow(INVALID_ISBN_LENGTH_ERROR);
  });

  test("不正なフォーマットのISBNの場合にエラーを投げる", () => {
    expect(() => new BookId("9994167158057")).toThrow(
      INVALID_ISBN_FORMAT_ERROR
    );
  });
});
