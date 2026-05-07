const prisma = require('../prisma');

const createNvqMetric = async (req, res) => {
  const {
    workforce_id,
    nvq_title,
    bolt_on_nvq,
    uln_number,
    po_number,
    card_scheme_category,
    site_address,
    site_contact_info,
    english_understanding_confirmed,
    tc_acknowledged,
    gdpr_consent,
    card_extension_date,
    date_registered,
    date_induction_booked,
    stage_of_nvq,
    notes,
    completed_date,
    certification_date
  } = req.body;

  try {
    const nvq = await prisma.nvqMetric.create({
      data: {
        workforce_id,
        nvq_title,
        bolt_on_nvq,
        uln_number,
        po_number,
        card_scheme_category,
        site_address,
        site_contact_info,
        english_understanding_confirmed: Boolean(english_understanding_confirmed),
        tc_acknowledged: Boolean(tc_acknowledged),
        gdpr_consent: Boolean(gdpr_consent),
        card_extension_date: card_extension_date ? new Date(card_extension_date) : null,
        date_registered: date_registered ? new Date(date_registered) : null,
        date_induction_booked: date_induction_booked ? new Date(date_induction_booked) : null,
        stage_of_nvq,
        notes,
        completed_date: completed_date ? new Date(completed_date) : null,
        certification_date: certification_date ? new Date(certification_date) : null
      },
      include: {
        workforce: {
          include: { company: true }
        }
      }
    });
    res.status(201).json(nvq);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getNvqMetrics = async (req, res) => {
  try {
    const nvq = await prisma.nvqMetric.findMany({
      include: {
        workforce: {
          include: { company: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(nvq);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteNvqMetric = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.nvqMetric.delete({ where: { id } });
    res.json({ message: 'NVQ metric deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createNvqMetric, getNvqMetrics, deleteNvqMetric };
