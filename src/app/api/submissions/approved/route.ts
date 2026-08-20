import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CUSTOM_APIS_FILE = path.join(process.cwd(), 'src', 'data', 'custom-apis.json');

export async function GET() {
  try {
    if (fs.existsSync(CUSTOM_APIS_FILE)) {
      const data = fs.readFileSync(CUSTOM_APIS_FILE, 'utf8');
      const customApis = JSON.parse(data);
      return NextResponse.json({ success: true, apis: customApis });
    }
    return NextResponse.json({ success: true, apis: [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not load custom apis' }, { status: 500 });
  }
}
