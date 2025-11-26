# Pixiv Spider Guide

The Pixiv Spider allows you to crawl images and user information from Pixiv.

## Configuration

#### 1. Before starting, you need to provide:
    **Cookie**: Your Pixiv session cookie.
    **User ID**: The target user's Pixiv ID.

##### The *Cookie* your should use key F12 `Developer Tools` to get it from pixiv web page after login.
<img src="/pixiv-spider-5.png" alt="Pixiv Spider Configuration" style="max-width: 650px; height: auto; border: 1px solid #ddd; border-radius: 6px;"><br>

#### 2. And then, you need to download crawler client from the <a href="https://github.com/fordeslorn/go-crawler-client/releases" target="_blank" rel="noopener noreferrer">releases page</a>.

#### 3. Unzip the downloaded file and modify the `user_config.json` file with field:
    **server_url**: change it to "api.2025003.xyz". 
    **token**: your token.

##### The *token* your should use key F12 `Developer Tools` to get it from the management-system web page after login.
<img src="/pixiv-spider-3.png" alt="Pixiv Spider Configuration" style="max-width: 650px; height: auto; border: 1px solid #ddd; border-radius: 6px;"><br>

**Change it!**
<img src="/pixiv-spider-2.png" alt="Pixiv Spider Configuration" style="max-width: 500px; height: auto; border: 1px solid #ddd; border-radius: 6px;"><br>


## Usage

#### 1. Run the crawler client executable. Make sure it's running before starting the spider.
If **successful**, you will see logs in the terminal like this:
<img src="/pixiv-spider-4.png" alt="Pixiv Spider Configuration" style="max-width: 500px; height: auto; border: 1px solid #ddd; border-radius: 6px;">

3. Input the target user's Pixiv ID and cookie. Click **Start Crawling**.
<img src="/pixiv-spider-1.png" alt="Pixiv Spider Configuration" style="max-width: 500px; height: auto; border: 1px solid #ddd; border-radius: 6px;">
4.  Wait for the process to complete. You can see the logs and preview images in real-time.😊<br><br>

## Troubleshooting

-   **Login Failed**: Check if your pixiv cookie is expired.
-   **No Images**: Ensure the target pixiv user has public works. Or your pixiv account settings turned on R18 related content.
-  **Client Errors**: Verify the crawler client configuration.
-  **Network Issues**: If you can't visit pixiv, you may need to set up a proxy in the crawler client configuration with field **proxy_host** and **proxy_port**.