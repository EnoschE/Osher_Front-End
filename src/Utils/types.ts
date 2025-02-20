// Defines the structure of a text snippet
export interface TextSnippet {
	_id: string;
	key: string;
	value: string;
	description: string;
	name: string;
	modifiedAt: Date;
	changed?: boolean;
}