import { NextRequest, NextResponse } from 'next/server';
import { mockMessageTemplates } from '@/lib/mock-data';
import { MessageTemplate } from '@/types/database';

// GET /api/messages/templates - List all message templates
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as MessageTemplate['category'] | null;
  const activeOnly = searchParams.get('activeOnly') !== 'false';

  let templates = [...mockMessageTemplates];

  // Filter by active status
  if (activeOnly) {
    templates = templates.filter((t) => t.is_active);
  }

  // Filter by category
  if (category) {
    templates = templates.filter((t) => t.category === category);
  }

  return NextResponse.json({
    templates,
    total: templates.length,
  });
}

// POST /api/messages/templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, content, category } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['appointment', 'reminder', 'document_request', 'general'];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    const newTemplate: MessageTemplate = {
      id: `mt${Date.now()}`,
      name,
      content,
      category: category || 'general',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    // Add to mock data
    mockMessageTemplates.push(newTemplate);

    return NextResponse.json({ template: newTemplate }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

// PATCH /api/messages/templates - Update a template
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, content, category, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const templateIndex = mockMessageTemplates.findIndex((t) => t.id === id);
    if (templateIndex === -1) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (name !== undefined) {
      mockMessageTemplates[templateIndex].name = name;
    }
    if (content !== undefined) {
      mockMessageTemplates[templateIndex].content = content;
    }
    if (category !== undefined) {
      mockMessageTemplates[templateIndex].category = category;
    }
    if (is_active !== undefined) {
      mockMessageTemplates[templateIndex].is_active = is_active;
    }

    return NextResponse.json({ template: mockMessageTemplates[templateIndex] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}
