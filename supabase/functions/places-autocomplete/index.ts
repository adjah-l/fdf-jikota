import { serve } from "https://deno.land/std@0.208.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { input, types = 'geocode', sessionToken } = await req.json()
    
    if (!input || input.length < 2) {
      return new Response(
        JSON.stringify({ predictions: [] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')
    if (!apiKey) {
      console.error('Google Places API key not found')
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Construct the Google Places Autocomplete API URL
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
    const params = new URLSearchParams({
      input,
      types,
      key: apiKey,
    })

    if (sessionToken) {
      params.append('sessiontoken', sessionToken)
    }

    console.log(`Making request to Google Places API for input: ${input}, types: ${types}`)
    
    const response = await fetch(`${baseUrl}?${params}`)
    const data = await response.json()

    if (!response.ok) {
      console.error('Google Places API error:', data)
      return new Response(
        JSON.stringify({ error: 'Google Places API error', details: data }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status 
        }
      )
    }

    console.log(`Successfully fetched ${data.predictions?.length || 0} predictions`)

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in places-autocomplete function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})