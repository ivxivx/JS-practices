CREATE TABLE locks (
	id bigserial NOT NULL,
	created_at timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	resource varchar(200) NOT NULL, -- wa
	"owner" varchar(50) NOT NULL,
	expires_at timestamptz(3) NOT NULL,

	CONSTRAINT locks_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX locks_resource_key ON locks USING btree (resource);
