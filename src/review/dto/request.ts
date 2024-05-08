export class ReviewCreateDTO {
  userId: string;
  userName: string;
  lineRevieew: string;
  grade: number;
  contentPosterImg: string;
  contentBackdeopIng: string;
  contentName: string;
  contentId: string;
  contentType: string;
}

export class ReviewUpdateDTO {
  userId: string;
  reviewId: string;
  lineRevieew: string;
  grade: number;
}

export class CursorDTO {
  limit?: number = 10;
  cursor?: string = null;
}

export class FindUserReviewsDTO extends CursorDTO {
  userId: string;
}

export class FindContentReviewsDTO extends CursorDTO {
  contentType: string;
  contentId: string;
}

export class FindTvReviewsDTO extends CursorDTO {
  contentType?: 'tv';
}
export class FindMovieReviewsDTO extends CursorDTO {
  contentType?: 'movie';
}
