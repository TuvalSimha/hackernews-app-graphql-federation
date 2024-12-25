export enum PostSortField {
  CREATED_AT = "CREATED_AT",
  TITLE = "TITLE",
  COMMENT_COUNT = "COMMENT_COUNT",
}

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export enum TimeRange {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
}

export interface PostSort {
  field: PostSortField;
  direction: SortDirection;
}

export interface CommentSort {
  direction: SortDirection;
}
