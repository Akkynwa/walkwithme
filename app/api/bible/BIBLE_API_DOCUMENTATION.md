# Bible API Documentation

This document outlines the implemented Bible API endpoints for the WalkWithMe application. These endpoints provide access to the free Bible API from jsDelivr CDN without requiring API keys.

## Base URL

```
/api/bible
```

## API Endpoints

### 1. Get Available Bible Versions

**Endpoint:** `GET /api/bible/versions`

Retrieves a list of all available Bible versions supported by the API.

**Parameters:** None

**Example Request:**
```bash
curl http://localhost:3000/api/bible/versions
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "en-asv",
      "name": "American Standard Version",
      "description": "Bible version in American Standard Version",
      "language": "English"
    },
    {
      "id": "en-kjv",
      "name": "King James Version",
      "description": "Bible version in King James Version",
      "language": "English"
    }
    // ... more versions
  ]
}
```

---

### 2. Get a Specific Verse

**Endpoint:** `GET /api/bible/[version]/books/[book]/chapters/[chapter]/verses/[verse]`

Retrieves a specific verse from the Bible.

**Path Parameters:**

| Parameter | Type   | Description                    | Example |
|-----------|--------|--------------------------------|---------|
| version   | string | Bible version ID               | en-asv  |
| book      | string | Book name (lowercase)          | genesis |
| chapter   | string | Chapter number                 | 1       |
| verse     | string | Verse number                   | 1       |

**Example Request:**
```bash
curl http://localhost:3000/api/bible/en-asv/books/genesis/chapters/1/verses/1
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "bookName": "Genesis",
    "chapter": 1,
    "verse": 1,
    "text": "In the beginning God created the heavens and the earth."
  }
}
```

---

### 3. Get an Entire Chapter

**Endpoint:** `GET /api/bible/[version]/books/[book]/chapters/[chapter]`

Retrieves all verses from a specific chapter.

**Path Parameters:**

| Parameter | Type   | Description                    | Example |
|-----------|--------|--------------------------------|---------|
| version   | string | Bible version ID               | en-asv  |
| book      | string | Book name (lowercase)          | genesis |
| chapter   | string | Chapter number                 | 1       |

**Example Request:**
```bash
curl http://localhost:3000/api/bible/en-asv/books/genesis/chapters/1
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "bookName": "Genesis",
    "chapter": 1,
    "verses": [
      {
        "verse": 1,
        "text": "In the beginning God created the heavens and the earth."
      },
      {
        "verse": 2,
        "text": "And the earth was without form, and void; and darkness was upon the face of the deep..."
      }
      // ... more verses
    ]
  }
}
```

---

## Supported Bible Versions

The API supports numerous Bible versions in multiple languages, including:

- **en-asv** - American Standard Version
- **en-kjv** - King James Version
- **en-niv** - New International Version
- **en-nlt** - New Living Translation
- And 300+ additional languages and translations

To get a complete list of supported versions, use the `/api/bible/versions` endpoint.

## Supported Books

Common book names include:
- **Old Testament:** genesis, exodus, leviticus, numbers, deuteronomy, joshua, judges, ruth, 1samuel, 2samuel, 1kings, 2kings, 1chronicles, 2chronicles, ezra, nehemiah, esther, job, psalms, proverbs, ecclesiastes, isaiah, jeremiah, lamentations, ezekiel, daniel, hosea, joel, amos, obadiah, jonah, micah, nahum, habakkuk, zephaniah, haggai, zechariah, malachi

- **New Testament:** matthew, mark, luke, john, acts, romans, 1corinthians, 2corinthians, galatians, ephesians, philippians, colossians, 1thessalonians, 2thessalonians, 1timothy, 2timothy, titus, philemon, hebrews, james, 1peter, 2peter, 1john, 2john, 3john, jude, revelation

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

**400 Bad Request** - Missing or invalid parameters
```json
{
  "success": false,
  "error": "Missing required parameters: version, book, chapter"
}
```

**404 Not Found** - Resource not found
```json
{
  "success": false,
  "error": "Failed to fetch verse: Not Found"
}
```

**500 Internal Server Error** - Server error
```json
{
  "success": false,
  "error": "Unknown error occurred"
}
```

## Key Features

- ✅ **No API Keys Required** - Completely free to use
- ✅ **Fast & Reliable** - Powered by jsDelivr CDN for blazing fast response times
- ✅ **Multiple Versions** - Access to numerous Bible translations
- ✅ **300+ Languages** - Support for 300+ languages and translations
- ✅ **Public Domain** - Access public domain Bible versions without copyright restrictions
- ✅ **Simple Integration** - RESTful API with straightforward JSON responses

## Usage Examples

### JavaScript/TypeScript

```typescript
// Get a specific verse
const response = await fetch('/api/bible/en-kjv/books/john/chapters/3/verses/16');
const { data } = await response.json();
console.log(data.text);

// Get an entire chapter
const chapterResponse = await fetch('/api/bible/en-asv/books/psalms/chapters/23');
const { data: chapter } = await chapterResponse.json();
console.log(`Psalm 23 has ${chapter.verses.length} verses`);

// Get available versions
const versionsResponse = await fetch('/api/bible/versions');
const { data: versions } = await versionsResponse.json();
console.log(`${versions.length} Bible versions available`);
```

### React Hook Example

```typescript
import { useEffect, useState } from 'react';

function BibleVerse() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bible/en-kjv/books/john/chapters/3/verses/16')
      .then((res) => res.json())
      .then((data) => {
        setVerse(data.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>
        {verse.bookName} {verse.chapter}:{verse.verse}
      </h3>
      <p>{verse.text}</p>
    </div>
  );
}
```

## Rate Limiting

Currently, there are no rate limits on these endpoints. However, it's recommended to implement caching strategies to optimize performance and reduce unnecessary requests to the underlying CDN API.

## Caching Recommendations

Since Bible content is static and doesn't change, consider implementing caching headers:

```typescript
const response = await fetch(url, {
  headers: {
    'Cache-Control': 'public, max-age=604800', // Cache for 7 days
  },
});
```

## Support

For issues or questions about the Bible API data source, visit:
- GitHub: https://github.com/wldeh/bible-api
- Documentation: https://github.com/wldeh/bible-api#readme
