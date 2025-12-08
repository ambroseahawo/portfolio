---
title: "Building Scalable APIs: Design Patterns That Actually Work"
coverImage: "/images/building-scalable-apis.jpg"
excerpt: "Comprehensive guide to designing REST and GraphQL APIs with rate-limiting, versioning, pagination, and authentication"
publishedAt: 2025-01-10T00:00:00.000Z
readTime: 8
featured: true
---

Modern APIs must handle thousands to millions of requests while maintaining performance, security, and developer experience. Let's examine proven patterns that scale.

![Post](/images/building-scalable-apis.jpg)

## 1. REST vs GraphQL: Architectural Showdown

### REST (Representational State Transfer)

```mermaid
graph LR
    Client-->|GET /users|API
    API-->|Query|Database
    Database-->|JSON|API
    API-->|200 OK|Client
```
*Figure 1: Typical REST request flow*

---

#### Pros:

*   Cache-friendly (HTTP caching)
*   Simple to implement
*   Stateless by design

#### Cons:

*   Over-fetching/under-fetching
*   Multiple round trips for complex data

#### Example:

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="ct35c">GET </span><span class="ct35c">/api/v1/users/123</span>
<span class="ct35c">Accept: </span><span class="ct35c">application/json</span>
<span class="ct35c">Authorization: </span><span class="ct35c">Bearer xyz</span></code>
</pre>

### GraphQL
```mermaid
graph LR
    Client-->|POST /graphql|API
    API-->|Resolver|UserService
    API-->|Resolver|PostsService
    API-->|Combined JSON|Client
```
*Figure 2: GraphQL request flow*

---

#### Pros:

*   Single request for complex data
*   Strong typing with schema
*   Client-driven queries

#### Cons:

*   Caching complexity
*   N+1 query problems
*   Performance monitoring challenges

#### Example:

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">query</span> {
  <span class="ct35c">user</span>(<span class="ct35c">id</span>: <span class="cuwxp">123</span>) {
    <span class="ct35c">name</span>
    <span class="ct35c">posts</span>(<span class="ct35c">limit</span>: <span class="cuwxp">5</span>) {
      <span class="ct35c">title</span>
      <span class="ct35c">comments</span>(<span class="ct35c">limit</span>: <span class="cuwxp">3</span>) {
        <span class="ct35c">text</span>
      }
    }
  }
}
</code></pre>

## 2. Rate Limiting: Protecting Your API

![Token Bucket Algorithm](/images/token-bucket-alg.png)

*Figure 3: Token bucket algorithm visualization*

---


The Token Bucket algorithm uses a bucket of tokens to limit and regulate the flow of requests.

### Implementation:

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">from</span> <span class="ct35c">fastapi</span> <span class="cd909">import</span> <span class="ct35c">FastAPI</span>, <span class="ct35c">Request</span>
<span class="cd909">from</span> <span class="ct35c">fastapi.responses</span> <span class="cd909">import</span> <span class="ct35c">JSONResponse</span>
<span class="cd909">from</span> <span class="ct35c">slowapi</span> <span class="cd909">import</span> <span class="ct35c">Limiter</span>, <span class="ct35c">_rate_limit_exceeded_handler</span>
<span class="cd909">from</span> <span class="ct35c">slowapi.util</span> <span class="cd909">import</span> <span class="ct35c">get_remote_address</span>
<span class="cd909">from</span> <span class="ct35c">slowapi.errors</span> <span class="cd909">import</span> <span class="ct35c">RateLimitExceeded</span>

<span class="ct35c">app</span> <span class="cb1xz">=</span> <span class="ct35c">FastAPI</span>()

<span class="ct35c">limiter</span> <span class="cb1xz">=</span> <span class="ct35c">Limiter</span>(<span class="ct35c">key_func</span><span class="cb1xz">=</span><span class="ct35c">get_remote_address</span>)
<span class="ct35c">app</span>.<span class="ct35c">state</span>.<span class="ct35c">limiter</span> <span class="cb1xz">=</span> <span class="ct35c">limiter</span>
<span class="ct35c">app</span>.<span class="ct35c">add_exception_handler</span>(<span class="ct35c">RateLimitExceeded</span>, <span class="ct35c">_rate_limit_exceeded_handler</span>)

<span class="cd909">@app.get</span>(<span class="cuwxp">"/api/data"</span>)
<span class="cd909">@limiter.limit</span>(<span class="cuwxp">"100/minute"</span>)
<span class="cd909">async def</span> <span class="ct35c">get_data</span>(<span class="ct35c">request</span>: <span class="ct35c">Request</span>):
    <span class="cd909">return</span> {<span class="cuwxp">"data"</span>: <span class="cuwxp">"rate limited API response"</span>}
</code></pre>

#### Common Strategies:

*   Fixed window (simple but allows bursts)
*   Sliding window (smoother but more overhead)
*   Dynamic limits (based on client reputation)

## 3. API Versioning: Future-Proofing

### Header-Based Versioning

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="ct35c">GET </span><span class="ct35c">/api/users/123</span>
<span class="ct35c">Accept: </span><span class="ct35c">application/vnd.company.api+json; version=2</span></code>
</pre>

#### Pros:

*   Clean URLs
*   Easy to test different versions

#### Cons:

*   Less discoverable

### URL Versioning

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="ct35c">GET </span><span class="ct35c">/api/v2/users/123</span></code>
</pre>

#### Migration Strategy:

1.   Support both versions for 6-12 months
2.   Log deprecated version usage
3.   Provide clear docs and upgrade paths

## 4. Pagination & Filtering Done Right

### Cursor-Based Pagination

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y">{
  <span class="ct35c">"data"</span>: <span class="cuwxp">[...]</span>,
  <span class="ct35c">"pagination"</span>: {
    <span class="ct35c">"next_cursor"</span>: <span class="cuwxp">"a1b2c3"</span>,
    <span class="ct35c">"has_more"</span>: <span class="cuwxp">true</span>
  }
}
</code></pre>

### Why not offset?

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">-- Problematic at scale:</span>
<span class="cd909">SELECT</span> <span class="ct35c">*</span> <span class="cd909">FROM</span> <span class="ct35c">posts</span> <span class="cd909">LIMIT</span> <span class="cuwxp">10</span> <span class="cd909">OFFSET</span> <span class="cuwxp">10000</span>;

<span class="cd909">-- Better with cursors:</span>
<span class="cd909">SELECT</span> <span class="ct35c">*</span> <span class="cd909">FROM</span> <span class="ct35c">posts</span> <span class="cd909">WHERE</span> <span class="ct35c">id</span> <span class="cb1xz">&gt;</span> <span class="cuwxp">'last_seen'</span> <span class="cd909">ORDER BY</span> <span class="ct35c">id</span> <span class="cd909">LIMIT</span> <span class="cuwxp">10</span>;
</code></pre>

### Filtering Implementation

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="ct35c">GET </span><span class="ct35c">/api/products?filter[price][gt]=100&filter[category]=electronics&sort=-created_at</span></code>
</pre>

#### Elasticsearch Example:

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y">{
  <span class="ct35c">"query"</span>: {
    <span class="ct35c">"bool"</span>: {
      <span class="ct35c">"must"</span>: [
        {<span class="ct35c">"range"</span>: {<span class="ct35c">"price"</span>: {<span class="ct35c">"gt"</span>: <span class="cuwxp">100</span>}}},
        {<span class="ct35c">"term"</span>: {<span class="ct35c">"category"</span>: <span class="cuwxp">"electronics"</span>}}
      ]
    }
  },
  <span class="ct35c">"sort"</span>: [{<span class="ct35c">"created_at"</span>: <span class="cuwxp">"desc"</span>}]
}
</code></pre>


## 5. Authentication for Scale

### JWT with Refresh Tokens

```mermaid
sequenceDiagram
    Client->>Auth: POST /login
    Auth->>Client: access_token (15min), refresh_token (7d)
    Client->>API: GET /data (with access_token)
    API->>Client: 200 OK
    Client->>Auth: POST /refresh (with refresh_token)
    Auth->>Client: new access_token
```
*Figure 4: JWT refresh flow*

---

### Security Considerations:

*   Store refresh tokens securely (httpOnly cookies)
*   Rotate refresh tokens
*   Short-lived access tokens (5-15 minutes)

### Implementation:

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y">// <span class="cd909">Express middleware</span>
<span class="cd909">const</span> <span class="ct35c">authenticate</span> <span class="cb1xz">=</span> (<span class="ct35c">req</span>, <span class="ct35c">res</span>, <span class="ct35c">next</span>) <span class="cb1xz">=&gt;</span> {
  <span class="cd909">const</span> <span class="ct35c">token</span> <span class="cb1xz">=</span> <span class="ct35c">req</span>.<span class="ct35c">cookies</span>.<span class="ct35c">access_token</span>;
  <span class="ct35c">jwt</span>.<span class="ct35c">verify</span>(<span class="ct35c">token</span>, <span class="ct35c">process</span>.<span class="ct35c">env</span>.<span class="ct35c">SECRET</span>, (<span class="ct35c">err</span>, <span class="ct35c">user</span>) <span class="cb1xz">=&gt;</span> {
    <span class="cd909">if</span> (<span class="ct35c">err</span>) <span class="cd909">return</span> <span class="ct35c">res</span>.<span class="ct35c">sendStatus</span>(<span class="cuwxp">403</span>);
    <span class="ct35c">req</span>.<span class="ct35c">user</span> <span class="cb1xz">=</span> <span class="ct35c">user</span>;
    <span class="ct35c">next</span>();
  });
};
</code></pre>


## In Conclusion

Building scalable APIs requires thoughtful architecture:

*   Choose REST for simplicity, GraphQL for flexibility
*   Implement robust rate limiting
*   Version intentionally
*   Optimize data retrieval patterns
*   Secure authentication flows