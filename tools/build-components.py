#!/usr/bin/env python3
"""Generate js/components.js from js/components.template.js.

The template fetches components/header.html and components/footer.html at
runtime. Browsers block fetch() on file:// URLs, so this script also inlines
the same markup into components.js as an offline fallback.

Run it from the project root after editing either component:

    python3 tools/build-components.py
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def to_js_template_literal(text: str) -> str:
    """Wrap markup in a JS template literal, escaping what would break it."""
    escaped = (
        text.replace("\\", "\\\\")
        .replace("`", "\\`")
        .replace("${", "\\${")
        .strip()
    )
    return "`" + escaped + "`"


def main() -> None:
    template = (ROOT / "js" / "components.template.js").read_text(encoding="utf-8")
    header = (ROOT / "components" / "header.html").read_text(encoding="utf-8")
    footer = (ROOT / "components" / "footer.html").read_text(encoding="utf-8")

    output = template.replace("__HEADER__", to_js_template_literal(header))
    output = output.replace("__FOOTER__", to_js_template_literal(footer))

    (ROOT / "js" / "components.js").write_text(output, encoding="utf-8")
    print("components.js generated ({} bytes)".format(len(output)))


if __name__ == "__main__":
    main()
