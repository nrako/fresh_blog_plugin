---
title: MyST Features
description: catalogue of MyST features
date: 2024-01-23 22:40:45 +0002
---

## Typography

### Line Breaks

Fleas\
Adam\
Had 'em.

By Strickland Gillilan

### Subscript & Superscript

H{sub}`2`O, and 4{sup}`th` of July

### Abbreviations

Well {abbr}`MyST (Markedly Structured Text)` is cool!

### Quotations

> We know what we are, but know not what we may be.
>
> - Hamlet act 4, Scene 5

### Definition Lists

Term 1 : Definition

Term 2 : Definition

### Footnotes

- A footnote reference[^myref]
- Manually-numbered footnote reference[^3]

[^myref]: This is an auto-numbered footnote definition. [^3]: This is a
manually-numbered footnote definition.

## Callouts

<!-- deno-fmt-ignore-start -->
:::{tip}
Try changing `tip` to `warning`!
:::
<!-- deno-fmt-ignore-end -->

## Images, figures & videos

### Image directive

```{image} https://source.unsplash.com/random/500x150?sunset
:alt: Beautiful Sunset
:width: 500px
:align: center
```

### Figure directive

```{figure} https://source.unsplash.com/random/400x200?beach,ocean
:name: myFigure
:alt: Random image of the beach or ocean!
:align: center

Relaxing at the beach 🏝 🌊 😎
```

### YouTube Video

:::{iframe} https://www.youtube.com/embed/F3st8X0L1Ys :width: 100% Get up and
running with MyST in Jupyter! :::

## Math and equations

### Inline Math

This math is a role, {math}`e=mc^2`, while this math is wrapped in dollar signs,
$Ax=b$.

### Equations

#### Math directives

```{math}
:label: my-equation
w_{t+1} = (1 + r_{t+1}) s(w_t) + y_{t+1}
```

See [](#my-equation) for more information!

#### Dollar math equations

$$ \label{maxwell} \begin{aligned} \nabla \times \vec{e}+\frac{\partial
\vec{b}}{\partial t}&=0 \\ \nabla \times \vec{h}-\vec{j}&=\vec{s}\_{e}
\end{aligned} $$

$$ \label{one-liner} Ax=b $$

See [](#maxwell) for enlightenment and [](#one-liner) to do things on one line!

## Tables

### Adding a Caption

:::{table} Table caption :label: table :align: center

| foo | bar |
| --- | --- |
| baz | bim |

:::

### List Tables

```{list-table} This table title
:header-rows: 1
:name: example-table

* - Training
  - Validation
* - 0
  - 5
* - 13720
  - 2744
```

## External References

### Wikipedia Links

Primordial <wiki:gravitational_waves> are hypothesized to arise from
<wiki:cosmic_inflation>, a faster-than-light expansion just after the
<wiki:big_bang>.

- [big bang](wiki:The_Big_Bang_Theory)
- [](wiki:big_bang)

### Github

[#87](https://github.com/executablebooks/myst-theme/pull/87)

### Research Resource Identifiers

[](rrid:SCR_008394)

<rrid:SCR_008394>

## Citations and bibliography

This is a link in markdown:
[Cockett, 2022](https://doi.org/10.5281/zenodo.6476040).

It is also possible to to drop the link text, that is:
<doi:10.5281/zenodo.6476040> or [](doi:10.5281/zenodo.6476040), which will
insert the citation text in the correct format (e.g. adding an italic “et al.”,
etc.).
