import { assertEquals } from "@std/assert";
import { validateMasterName, validateMovieForm } from "~/core/validate.ts";
import type { DashboardErrorCode } from "~/core/message.ts";

/** 検証用のULID。実在する値である必要はないが形式は正しいもの */
const THEATER_ID = "01KZRWVJ3F0J3Y8ER5YDT45CGY";
const FORMAT_ID = "01KZRWZDYKPJNZFNNJ8WSJWHYB";
const COMPANION_TYPE_ID = "01KZRX1P8QW4V7T2N5J3H6D9F0";

/**
 * 検証を通る鑑賞作品フォームの入力値を生成する
 * @param overrides 上書きする項目
 */
const buildBody = (
  overrides: Record<string, string> = {},
): URLSearchParams =>
  new URLSearchParams({
    title: "君の名は。",
    theater_id: THEATER_ID,
    view_date: "2023-09-11",
    view_start_time: "19:00",
    view_end_time: "21:30",
    format_id: FORMAT_ID,
    companion_type_id: COMPANION_TYPE_ID,
    accompanier: "2",
    rating: "4",
    comment: "面白かった",
    ...overrides,
  });

Deno.test("鑑賞作品フォームの検証テスト", async (t) => {
  await t.step("正常系", async (t) => {
    await t.step("すべて入力されている", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody()),
        null,
      );
    });
    await t.step("任意項目が空文字", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({
          format_id: "",
          companion_type_id: "",
          accompanier: "",
          rating: "",
          comment: "",
        })),
        null,
      );
    });
    await t.step("同伴者数が0", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ accompanier: "0" })),
        null,
      );
    });
    await t.step("秒まで指定した時間", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ view_start_time: "19:00:30" })),
        null,
      );
    });
  });

  await t.step("タイトル", async (t) => {
    await t.step("未入力", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ title: "" })),
        "invalid-title",
      );
    });
    await t.step("246文字は通る", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ title: "あ".repeat(246) })),
        null,
      );
    });
    await t.step("247文字は弾く", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ title: "あ".repeat(247) })),
        "invalid-title",
      );
    });
  });

  await t.step("映画館（ULID）", async (t) => {
    await t.step("未選択", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ theater_id: "" })),
        "invalid-theater",
      );
    });
    await t.step("移行前の連番idは弾く", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ theater_id: "1" })),
        "invalid-theater",
      );
    });
    await t.step("ULIDではない文字列", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ theater_id: "none" })),
        "invalid-theater",
      );
    });
    await t.step("25文字は弾く", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ theater_id: THEATER_ID.slice(0, 25) })),
        "invalid-theater",
      );
    });
    await t.step("27文字は弾く", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ theater_id: `${THEATER_ID}0` })),
        "invalid-theater",
      );
    });
    await t.step("Crockford Base32で使わない文字は弾く", async (t) => {
      // I・L・O・Uは可読性のためULIDの文字集合から除かれている
      for (const char of ["I", "L", "O", "U"]) {
        await t.step(char, () => {
          assertEquals<DashboardErrorCode | null>(
            validateMovieForm(
              buildBody({ theater_id: THEATER_ID.slice(0, 25) + char }),
            ),
            "invalid-theater",
          );
        });
      }
    });
    await t.step("小文字は弾く", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ theater_id: THEATER_ID.toLowerCase() })),
        "invalid-theater",
      );
    });
  });

  await t.step("日時", async (t) => {
    await t.step("鑑賞日が未入力", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ view_date: "" })),
        "invalid-datetime",
      );
    });
    await t.step("鑑賞日の形式が不正", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ view_date: "2023/09/11" })),
        "invalid-datetime",
      );
    });
    await t.step("上映開始時間が未入力", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ view_start_time: "" })),
        "invalid-datetime",
      );
    });
    await t.step("上映終了時間の形式が不正", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ view_end_time: "25:00" })),
        "invalid-datetime",
      );
    });
  });

  await t.step("鑑賞形式・同伴者分類（任意のULID）", async (t) => {
    await t.step("鑑賞形式がULIDではない", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ format_id: "imax" })),
        "invalid-format",
      );
    });
    await t.step("鑑賞形式が移行前の連番id", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ format_id: "2" })),
        "invalid-format",
      );
    });
    await t.step("同伴者分類がULIDではない", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ companion_type_id: "3" })),
        "invalid-companion-type",
      );
    });
  });

  await t.step("同伴者数", async (t) => {
    await t.step("負の数", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ accompanier: "-1" })),
        "invalid-accompanier",
      );
    });
    await t.step("数値ではない", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ accompanier: "abc" })),
        "invalid-accompanier",
      );
    });
    await t.step("小数", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ accompanier: "1.5" })),
        "invalid-accompanier",
      );
    });
  });

  await t.step("評価", async (t) => {
    await t.step("下限未満", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ rating: "0" })),
        "invalid-rating",
      );
    });
    await t.step("上限超過", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ rating: "6" })),
        "invalid-rating",
      );
    });
    await t.step("下限と上限は通る", () => {
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ rating: "1" })),
        null,
      );
      assertEquals<DashboardErrorCode | null>(
        validateMovieForm(buildBody({ rating: "5" })),
        null,
      );
    });
  });
});

Deno.test("マスタデータ名称の検証テスト", async (t) => {
  await t.step("正常な名称", () => {
    assertEquals<DashboardErrorCode | null>(
      validateMasterName("IMAXレーザー"),
      null,
    );
  });
  await t.step("未入力", () => {
    assertEquals<DashboardErrorCode | null>(
      validateMasterName(""),
      "invalid-name",
    );
  });
  await t.step("null", () => {
    assertEquals<DashboardErrorCode | null>(
      validateMasterName(null),
      "invalid-name",
    );
  });
  await t.step("246文字は通る", () => {
    assertEquals<DashboardErrorCode | null>(
      validateMasterName("あ".repeat(246)),
      null,
    );
  });
  await t.step("247文字は弾く", () => {
    assertEquals<DashboardErrorCode | null>(
      validateMasterName("あ".repeat(247)),
      "invalid-name",
    );
  });
});
