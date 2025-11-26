interface JsonLdProps {
  data: Record<string, any>;
}

// Componente para adicionar JSON-LD structured data
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
