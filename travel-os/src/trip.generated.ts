/* Generated from canonical schema. Do not edit. */

/**
 * Data exchange package; no personal secrets; draft by default. Validate cross-references semantically as well.
 */
export type TravelOSTripPackage100 = {
  schemaVersion: "1.0.0";
  tripId: string;
  slug: string;
  status: "draft" | "ready" | "published" | "archived";
  name: string;
  summary: string;
  destination: {
    continent: string;
    countryCode: string;
    countryName: string;
    region: string | null;
    cities: string[];
  };
  dates: {
    kind: "fixed" | "flexible";
    startDate: string | null;
    endDate: string | null;
    timezone: string;
    durationDays: number;
  };
  travelers: {
    adults: number;
    children: number;
  };
  media: {
    coverImage: {
      url: string;
      alt: string;
      license: string;
      attribution: string;
      sourceUrl: string;
    } | null;
    themeAccent: string | null;
  };
  /**
   * @minItems 1
   */
  itinerary: [
    {
      id: string;
      dayNumber: number;
      date: string | null;
      title: string;
      description: string | null;
      events: {
        id: string;
        title: string;
        description: string | null;
        placeId: string | null;
        startTime: string | null;
        endTime: string | null;
        durationMinutes: number | null;
        transportMode: ("walk" | "car" | "bus" | "train" | "metro" | "plane" | "ferry" | "taxi" | "other") | null;
        priceIds: string[];
        sourceIds: string[];
        externalLinks: string[];
      }[];
    },
    ...{
      id: string;
      dayNumber: number;
      date: string | null;
      title: string;
      description: string | null;
      events: {
        id: string;
        title: string;
        description: string | null;
        placeId: string | null;
        startTime: string | null;
        endTime: string | null;
        durationMinutes: number | null;
        transportMode: ("walk" | "car" | "bus" | "train" | "metro" | "plane" | "ferry" | "taxi" | "other") | null;
        priceIds: string[];
        sourceIds: string[];
        externalLinks: string[];
      }[];
    }[]
  ];
  places: {
    id: string;
    name: string;
    category: "landmark" | "museum" | "restaurant" | "hotel" | "concert" | "transport" | "tour" | "city" | "other";
    address: string | null;
    location: {
      latitude: number;
      longitude: number;
    } | null;
    description: string | null;
    sourceIds: string[];
  }[];
  transportOptions: {
    id: string;
    label: string;
    description: string | null;
    /**
     * @minItems 1
     */
    legs: [
      {
        id: string;
        mode: "plane" | "train" | "car" | "bus" | "ferry" | "metro" | "walk" | "taxi" | "other";
        from: string;
        to: string;
        date: string | null;
        departTime: string | null;
        arriveTime: string | null;
        arriveDate: string | null;
        priceIds: string[];
        sourceIds: string[];
        notes: string | null;
      },
      ...{
        id: string;
        mode: "plane" | "train" | "car" | "bus" | "ferry" | "metro" | "walk" | "taxi" | "other";
        from: string;
        to: string;
        date: string | null;
        departTime: string | null;
        arriveTime: string | null;
        arriveDate: string | null;
        priceIds: string[];
        sourceIds: string[];
        notes: string | null;
      }[]
    ];
    priceIds: string[];
    sourceIds: string[];
  }[];
  accommodationOptions: {
    id: string;
    name: string;
    placeId: string | null;
    checkIn: string | null;
    checkOut: string | null;
    description: string | null;
    priceIds: string[];
    sourceIds: string[];
  }[];
  priceRecords: {
    id: string;
    amount: number;
    currency: string;
    basis: "per_person" | "per_group" | "per_night" | "per_item" | "total";
    recordedAt: string;
    isEstimate: boolean;
    sourceIds: string[];
    notes: string | null;
  }[];
  sources: {
    id: string;
    title: string;
    url: string;
    checkedAt: string;
    type: "operator" | "government" | "aggregator" | "review" | "guide" | "other";
    notes: string | null;
  }[];
  unresolved: {
    id: string;
    severity: "blocking" | "warning" | "info";
    question: string;
    relatedIds: string[];
  }[];
  tags: string[];
  geo: {
    routeStatus: "missing" | "schematic" | "verified";
    notes: string | null;
  };
};
