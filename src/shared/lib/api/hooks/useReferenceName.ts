import { useMemo } from "react";
import { useLocale } from "next-intl";

interface Named {
  nameEn: string;
  nameAr?: string | null;
}

interface Country extends Named {
  nationalityNameEn?: string | null;
  nationalityNameAr?: string | null;
}

/**
 * Reference items' names in the app's language. Some lists (majors, institutions, cities) carry
 * the English name in nameAr too, so those simply stay English. The functions change only with
 * the language, so they're safe as memo dependencies.
 */
export function useReferenceName() {
  const arabic = useLocale() === "ar";

  return useMemo(
    () => ({
      name: (item: Named) => (arabic && item.nameAr) || item.nameEn,
      // The API has no Arabic nationality names yet, so Arabic falls back to the country's name.
      nationality: (country: Country) =>
        arabic
          ? country.nationalityNameAr || country.nameAr || country.nameEn
          : country.nationalityNameEn || country.nameEn,
    }),
    [arabic],
  );
}
