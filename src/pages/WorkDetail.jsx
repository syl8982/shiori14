import { Link, Navigate, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { getArtistBySlug } from '../data/artists'
import { getContactLink, parseContactLines } from '../data/workContact'
import { getWorkImagesBySlug, mergeWorkImageOptions } from '../data/workImages'
import './SubPageLayout.css'
import './WorkDetail.css'

const DEFAULT_LAYOUT = 'portrait'

const DEFAULT_OBJECT_POSITION = 'center center'
const DEFAULT_IMAGE_SCALE = 1

function getVerticalAnchor(objectPosition) {
  if (objectPosition.includes('bottom') || objectPosition.includes('100%')) return 'bottom'
  if (objectPosition.includes('top') || /(?:^|\s)0%/.test(objectPosition)) return 'top'

  const parts = objectPosition.trim().split(/\s+/)
  const vertical = parts.length === 1 ? parts[0] : parts[1]
  if (vertical?.endsWith('%')) {
    const value = Number.parseFloat(vertical)
    if (value > 50) return 'bottom'
    if (value < 50) return 'top'
  }

  return 'center'
}

function getHorizontalAnchor(objectPosition) {
  if (objectPosition.includes('left')) return 'left'
  if (objectPosition.includes('right')) return 'right'

  const parts = objectPosition.trim().split(/\s+/)
  const horizontal = parts.length === 1 ? parts[0] : parts[0]
  if (horizontal?.endsWith('%')) {
    const value = Number.parseFloat(horizontal)
    if (value > 50) return 'right'
    if (value < 50) return 'left'
  }

  return 'center'
}

function getWorkImageCropStyle(image) {
  const objectPosition = image.objectPosition ?? DEFAULT_OBJECT_POSITION
  const scale = image.scale ?? DEFAULT_IMAGE_SCALE

  if (scale === DEFAULT_IMAGE_SCALE) {
    return {
      objectPosition,
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
    }
  }

  const vertical = getVerticalAnchor(objectPosition)
  const horizontal = getHorizontalAnchor(objectPosition)
  const style = {
    objectPosition,
    position: 'absolute',
    width: `${scale * 100}%`,
    height: `${scale * 100}%`,
    maxWidth: 'none',
    maxHeight: 'none',
  }

  if (vertical === 'bottom') {
    style.top = 'auto'
    style.bottom = '0'
  } else if (vertical === 'top') {
    style.top = '0'
    style.bottom = 'auto'
  } else {
    style.top = '50%'
  }

  if (horizontal === 'left') {
    style.left = '0'
    style.transform = vertical === 'center' ? 'translateY(-50%)' : undefined
  } else if (horizontal === 'right') {
    style.right = '0'
    style.left = 'auto'
    style.transform = vertical === 'center' ? 'translateY(-50%)' : undefined
  } else {
    style.left = '50%'
    style.transform =
      vertical === 'center' ? 'translate(-50%, -50%)' : 'translateX(-50%)'
  }

  return style
}

function WorkDetailImage({
  image,
  title,
  index,
  loading = 'lazy',
  className = '',
  mobileFullFit = false,
}) {
  const scale = image.scale ?? DEFAULT_IMAGE_SCALE
  const isScaled = !mobileFullFit && scale !== DEFAULT_IMAGE_SCALE

  return (
    <figure className={`work-detail__image-frame ${className}`.trim()}>
      <img
        className={`work-detail__image${isScaled ? ' work-detail__image--scaled' : ''}`}
        src={image.src}
        alt={image.alt ?? (title ? `${title} 작업 이미지 ${index + 1}` : '')}
        loading={loading}
        decoding="async"
        style={
          mobileFullFit
            ? { objectPosition: image.objectPosition ?? DEFAULT_OBJECT_POSITION }
            : getWorkImageCropStyle(image)
        }
      />
    </figure>
  )
}

function getThreeImageLayoutClass(layout) {
  return layout === 'landscape'
    ? 'work-detail__images--layout-landscape'
    : 'work-detail__images--layout-portrait'
}

function WorkDetailImages({
  images,
  title,
  layout = DEFAULT_LAYOUT,
  galleryAspect,
  galleryColumns,
  artistSlug,
}) {
  const items = images.slice(0, 3)
  const count = items.length
  const isRowLayout = count === 2 && layout === 'row'
  const isRowSplit = isRowLayout && galleryColumns
  const isJeonsohyeonPortraitFit = (index) =>
    artistSlug === 'jeonsohyeon' && index > 0

  if (count === 0) {
    return (
      <div className="work-detail__images work-detail__images--count-0" aria-hidden="true">
        <span className="work-detail__image-placeholder" />
      </div>
    )
  }

  if (count === 3) {
    const isRowLayout = layout === 'row'
    const isRowSplit = isRowLayout && galleryColumns

    return (
      <div
        className={[
          'work-detail__images',
          'work-detail__images--count-3',
          isRowLayout ? 'work-detail__images--layout-row' : getThreeImageLayoutClass(layout),
          isRowSplit ? 'work-detail__images--layout-row-split' : '',
          artistSlug ? `work-detail__images--artist-${artistSlug}` : '',
        ].filter(Boolean).join(' ')}
        style={
          isRowSplit
            ? {
                '--work-detail-row-columns': galleryColumns,
                '--work-detail-row-gallery-aspect': galleryAspect ?? '17 / 6',
              }
            : undefined
        }
        aria-label="작업 이미지"
      >
        <WorkDetailImage
          image={items[0]}
          title={title}
          index={0}
          loading="eager"
          className={isRowSplit ? '' : 'work-detail__image-frame--lead'}
        />
        <WorkDetailImage
          image={items[1]}
          title={title}
          index={1}
          className={isJeonsohyeonPortraitFit(1) ? 'work-detail__image-frame--mobile-full-portrait' : ''}
          mobileFullFit={isJeonsohyeonPortraitFit(1)}
        />
        <WorkDetailImage
          image={items[2]}
          title={title}
          index={2}
          className={isJeonsohyeonPortraitFit(2) ? 'work-detail__image-frame--mobile-full-portrait' : ''}
          mobileFullFit={isJeonsohyeonPortraitFit(2)}
        />
      </div>
    )
  }

  return (
    <div
      className={[
        'work-detail__images',
        `work-detail__images--count-${count}`,
        isRowLayout ? 'work-detail__images--layout-row' : '',
        isRowSplit ? 'work-detail__images--layout-row-split' : '',
        artistSlug ? `work-detail__images--artist-${artistSlug}` : '',
      ].filter(Boolean).join(' ')}
      style={
        isRowSplit
          ? {
              '--work-detail-row-columns': galleryColumns,
              '--work-detail-row-gallery-aspect': galleryAspect ?? '21 / 8',
            }
          : isRowLayout && galleryAspect
            ? { '--work-detail-row-image-aspect': galleryAspect }
            : undefined
      }
      aria-label="작업 이미지"
    >
      {items.map((image, index) => (
        <WorkDetailImage
          key={`${image.src}-${index}`}
          image={image}
          title={title}
          index={index}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  )
}

function WorkDetailContact({ contact }) {
  const lines = parseContactLines(contact)
  if (!lines.length) return null

  return (
    <footer className="work-detail__footer">
      <div className="work-detail__contact">
        {lines.map((line) => {
          const href = getContactLink(line)

          if (href) {
            return (
              <a
                key={line}
                className="work-detail__contact-link"
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noreferrer noopener'}
              >
                {line}
              </a>
            )
          }

          return (
            <span key={line} className="work-detail__contact-line">
              {line}
            </span>
          )
        })}
      </div>
    </footer>
  )
}

function WorkDetailMeta({ artist, work }) {
  const {
    title = '작업 제목',
    nameEn = '',
    contact = '',
    paragraphs = [],
  } = work

  return (
    <section className="work-detail__meta" aria-label="작업 정보">
      <div className="work-detail__meta-head">
        <h1 className="work-detail__work-title">{title}</h1>

        <p className="work-detail__artist-name">
          {artist.name}
          {nameEn ? ` ${nameEn}` : ''}
        </p>

        <hr className="work-detail__divider" />
      </div>

      {paragraphs.length > 0 ? (
        <div className="work-detail__description">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="subpage__text work-detail__paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      <WorkDetailContact contact={contact} />
    </section>
  )
}

function WorkDetail() {
  const { slug } = useParams()
  const artist = getArtistBySlug(slug)

  if (!artist) {
    return <Navigate to="/work" replace />
  }

  const work = artist.work ?? {}
  const images = mergeWorkImageOptions(getWorkImagesBySlug(slug), artist.galleryImages ?? [])

  return (
    <PageShell contentClassName="subpage__content subpage__content--page subpage__content--work-detail">
      <nav className="work-detail__nav" aria-label="작업 페이지 이동">
        <Link className="work-detail__back" to="/work">
          ← 작업
        </Link>
      </nav>

      <article className="work-detail">
        <WorkDetailImages
          images={images}
          title={work.title}
          layout={artist.layout ?? DEFAULT_LAYOUT}
          galleryAspect={artist.galleryAspect}
          galleryColumns={artist.galleryColumns}
          artistSlug={slug}
        />
        <WorkDetailMeta artist={artist} work={work} />
      </article>
    </PageShell>
  )
}

export default WorkDetail
