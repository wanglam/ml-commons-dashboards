import React, { useCallback, useRef } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiTextArea,
  EuiButton,
  EuiSelect,
  EuiSpacer,
} from '@elastic/eui';
import { APIProvider } from '../../apis/api_provider';
import { InnerHttpProvider } from '../../apis/inner_http_provider';

export function OpenAIQuery() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLTextAreaElement>(null);
  const opensearchOutRef = useRef<HTMLTextAreaElement>(null);

  const handleQuery = useCallback(() => {
    if (!resultRef.current) {
      return;
    }
    const [path, ...restLines] = resultRef.current.value.trim().split('\n');
    InnerHttpProvider.getHttp()
      .post('/api/console/proxy', {
        query: {
          path,
          method: 'GET',
        },
        body: JSON.stringify(JSON.parse(restLines.join('\n'))),
      })
      .then((payload) => {
        if (opensearchOutRef.current) {
          opensearchOutRef.current.value = JSON.stringify(payload, null, 4);
        }
      });
  }, []);

  const handleRun = useCallback(() => {
    const inputText = inputRef.current?.value;
    if (!inputText) {
      return;
    }
    APIProvider.getAPI('openAI')
      .getCompletion({
        prompt: `
    ###
    I have a opensearch index, here is the mapping
    {
      "opensearch_dashboards_sample_data_flights": {
        "mappings": {
          "properties": {
            "AvgTicketPrice": {
              "type": "float"
            },
            "Cancelled": {
              "type": "boolean"
            },
            "Carrier": {
              "type": "keyword"
            },
            "Dest": {
              "type": "keyword"
            },
            "DestAirportID": {
              "type": "keyword"
            },
            "DestCityName": {
              "type": "keyword"
            },
            "DestCountry": {
              "type": "keyword"
            },
            "DestLocation": {
              "type": "geo_point"
            },
            "DestRegion": {
              "type": "keyword"
            },
            "DestWeather": {
              "type": "keyword"
            },
            "DistanceKilometers": {
              "type": "float"
            },
            "DistanceMiles": {
              "type": "float"
            },
            "FlightDelay": {
              "type": "boolean"
            },
            "FlightDelayMin": {
              "type": "integer"
            },
            "FlightDelayType": {
              "type": "keyword"
            },
            "FlightNum": {
              "type": "keyword"
            },
            "FlightTimeHour": {
              "type": "keyword"
            },
            "FlightTimeMin": {
              "type": "float"
            },
            "Origin": {
              "type": "keyword"
            },
            "OriginAirportID": {
              "type": "keyword"
            },
            "OriginCityName": {
              "type": "keyword"
            },
            "OriginCountry": {
              "type": "keyword"
            },
            "OriginLocation": {
              "type": "geo_point"
            },
            "OriginRegion": {
              "type": "keyword"
            },
            "OriginWeather": {
              "type": "keyword"
            },
            "dayOfWeek": {
              "type": "integer"
            },
            "timestamp": {
              "type": "date"
            }
          }
        }
      }
    }
    ${inputText}
    ###
    GET
    `.trim(),
      })
      .then((payload) => {
        if (!resultRef.current) {
          return;
        }
        resultRef.current.value = payload[0]?.text;
        handleQuery();
      });
  }, [handleQuery]);

  return (
    <EuiFlexGroup>
      <EuiFlexItem>
        Index:
        <EuiSpacer />
        <EuiSelect options={[{ text: 'Flights' }]} />
        <EuiSpacer />
        Input Text:
        <EuiSpacer />
        <EuiTextArea fullWidth inputRef={inputRef} />
        <EuiSpacer />
        <EuiButton onClick={handleRun}>Run</EuiButton>
        <EuiSpacer />
        OpenAI Result:
        <EuiSpacer />
        <EuiTextArea fullWidth inputRef={resultRef} />
        <EuiSpacer />
        <EuiButton onClick={handleQuery}>Query</EuiButton>
      </EuiFlexItem>
      <EuiFlexItem>
        OpenSearch Result:
        <EuiSpacer />
        <EuiTextArea inputRef={opensearchOutRef} fullWidth style={{ height: '100%' }} />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
