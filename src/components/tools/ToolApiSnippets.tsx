'use client';

import React, { useState } from 'react';
import { DeveloperTool } from '@/data/tools';
import { Check, Copy, Terminal, Code2, Sparkles } from 'lucide-react';

interface ToolApiSnippetsProps {
  tool: DeveloperTool;
  lang: 'tr' | 'en';
}

type LangTab = 'curl' | 'js' | 'python' | 'go' | 'php';

export default function ToolApiSnippets({ tool, lang }: ToolApiSnippetsProps) {
  const [activeTab, setActiveTab] = useState<LangTab>('curl');
  const [copied, setCopied] = useState(false);

  const baseUrl = 'https://freeapi.website';
  const fullEndpointUrl = `${baseUrl}${tool.endpoint}`;

  const generateSnippet = (type: LangTab): string => {
    const isPost = tool.httpMethod === 'POST';
    const sampleBody = tool.sampleRequest?.body ? JSON.stringify(tool.sampleRequest.body, null, 2) : '';

    switch (type) {
      case 'curl':
        if (isPost) {
          return `curl -X POST "${fullEndpointUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${tool.sampleRequest?.body ? JSON.stringify(tool.sampleRequest.body) : '{"data":"..."}'}'`;
        }
        return `curl -X GET "${tool.sampleRequest?.url || fullEndpointUrl}"`;

      case 'js':
        if (isPost) {
          return `// JavaScript (Fetch API / Node.js 18+)
const response = await fetch('${fullEndpointUrl}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(${sampleBody || '{\n    "data": "value"\n  }'}),
});

const data = await response.json();
console.log(data);`;
        }
        return `// JavaScript (Fetch API / Node.js 18+)
const response = await fetch('${tool.sampleRequest?.url || fullEndpointUrl}');
const data = await response.json();
console.log(data);`;

      case 'python':
        if (isPost) {
          return `# Python 3 (requests)
import requests

url = "${fullEndpointUrl}"
payload = ${sampleBody ? sampleBody.replace(/true/g, 'True').replace(/false/g, 'False') : '{"data": "value"}'}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;
        }
        return `# Python 3 (requests)
import requests

url = "${tool.sampleRequest?.url || fullEndpointUrl}"
response = requests.get(url)
print(response.json())`;

      case 'go':
        if (isPost) {
          return `// Go (net/http)
package main

import (
\t"bytes"
\t"fmt"
\t"io"
\t"net/http"
)

func main() {
\turl := "${fullEndpointUrl}"
\tpayload := []byte(\`${sampleBody || '{"data": "value"}'}\`)

\treq, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
\treq.Header.Set("Content-Type", "application/json")

\tclient := &http.Client{}
\tresp, err := client.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\tbody, _ := io.ReadAll(resp.Body)
\tfmt.Println(string(body))
}`;
        }
        return `// Go (net/http)
package main

import (
\t"fmt"
\t"io"
\t"net/http"
)

func main() {
\tresp, err := http.Get("${tool.sampleRequest?.url || fullEndpointUrl}")
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\tbody, _ := io.ReadAll(resp.Body)
\tfmt.Println(string(body))
}`;

      case 'php':
        if (isPost) {
          return `<?php
// PHP cURL
$ch = curl_init('${fullEndpointUrl}');
$payload = json_encode(${sampleBody ? sampleBody.replace(/:/g, ' =>') : '["data" => "value"]'});

curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type:application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);

echo $result;
?>`;
        }
        return `<?php
// PHP file_get_contents / cURL
$response = file_get_contents('${tool.sampleRequest?.url || fullEndpointUrl}');
$data = json_decode($response, true);
print_r($data);
?>`;

      default:
        return '';
    }
  };

  const currentCode = generateSnippet(activeTab);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: LangTab; label: string }[] = [
    { id: 'curl', label: 'cURL' },
    { id: 'js', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'go', label: 'Go' },
    { id: 'php', label: 'PHP' },
  ];

  return (
    <div className="mt-12 rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/60 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              {lang === 'tr' ? 'Canlı API Entegrasyonu' : 'Live API Integration'}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                <Sparkles className="h-3 w-3" /> 0ms Local Edge
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'tr'
                ? 'Bu aracı kendi yazılımında veya backend servislerinde REST API olarak çağır.'
                : 'Call this tool in your codebase or backend services directly via REST API.'}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Code Area */}
      <div className="relative group p-6 bg-slate-950/90">
        <button
          onClick={handleCopy}
          className="absolute right-6 top-6 flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur transition-all hover:bg-slate-700 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">{lang === 'tr' ? 'Kopyalandı!' : 'Copied!'}</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>{lang === 'tr' ? 'Kodu Kopyala' : 'Copy Code'}</span>
            </>
          )}
        </button>

        <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-emerald-300/90 selection:bg-emerald-500/30">
          <code>{currentCode}</code>
        </pre>
      </div>

      {/* Endpoint Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950/40 px-6 py-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono font-semibold text-emerald-400 border border-slate-700">
            {tool.httpMethod}
          </span>
          <span className="font-mono text-slate-300">{tool.endpoint}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Code2 className="h-3.5 w-3.5" />
          <span>{lang === 'tr' ? 'Sıfır API Anahtarı Gerekir (Public Edge)' : 'No API Key Required (Public Edge)'}</span>
        </div>
      </div>
    </div>
  );
}
