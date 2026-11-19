# API reference

Base URL (local): `http://localhost:4000`

## Health

`GET /api/health` returns `{ "status": "ok", "time": "..." }`.

## Albums

### List albums

`GET /api/albums`

Optional query parameters:

| Parameter | Example | Meaning |
| --- | --- | --- |
| `q` | `weeknd` | Search in title and artist |
| `genre` | `Hip-Hop` | Only this genre |
| `artist` | `Drake` | Only this artist |
| `minPrice` | `20` | Price from this amount, in dollars |
| `maxPrice` | `25` | Price up to this amount, in dollars |
| `sort` | `price_desc` | One of `price_asc`, `price_desc`, `title`, `newest` |
| `page` | `2` | Return one page of results. The total count is in the `X-Total-Count` header. Without it, all albums are returned. |
| `limit` | `12` | Albums per page (default 12, maximum 50). Only used with `page`. |

Parameters can be combined. Invalid `maxPrice` returns `400`.

### Get one album

`GET /api/albums/:slug` returns the album and its `tracks`. Unknown slug returns `404`.