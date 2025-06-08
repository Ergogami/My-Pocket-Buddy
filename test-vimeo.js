// Test Vimeo API connection

async function testVimeoConnection() {
  const accessToken = process.env.VIMEO_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.log('No Vimeo access token found');
    return;
  }
  
  try {
    const response = await fetch('https://api.vimeo.com/me/videos', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.vimeo.*+json;version=3.4'
      }
    });
    
    if (!response.ok) {
      console.log('Vimeo API error:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('Vimeo videos found:', data.total);
    
    if (data.data && data.data.length > 0) {
      console.log('First video:', {
        name: data.data[0].name,
        link: data.data[0].link,
        player_embed_url: data.data[0].player_embed_url
      });
    }
    
  } catch (error) {
    console.error('Error testing Vimeo:', error.message);
  }
}

testVimeoConnection();